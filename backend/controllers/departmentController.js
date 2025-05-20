import Department from '../models/Department.js';
import Comment from '../models/Comment.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import imagekit from '../utils/imagekit.js';
import sendEmail from '../utils/sendEmail.js';
import generateOTP from '../utils/generateOTP.js';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,}$/;
  return passwordRegex.test(password);
};



// ==================== Department Signup ====================
export const signupDepartment = async (req, res) => {
  try {
    const {
      name, email, password, state, district,
      workingAreas, phone, whatsapp, telephone,
    } = req.body;

    // Check duplicate
    const existingDept = await Department.findOne({ email });
    if (existingDept) {
      return res.status(400).json({ message: 'Department already exists' });
    }

    // Password validation

    if (!validatePassword(password)) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters, have at least one letter and one number, and only use letters, numbers, or !@#$%^&*.'
      });
    }

    // Hash password and generate OTP
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP(); // keep OTP as number

    // Optional photo upload
    let imageUrl = null;
    let imageFileId = null;
    if (req.file) {
      const uploaded = await imagekit.upload({
        file: req.file.buffer,
        fileName: `dept_${email}_${Date.now()}.jpg`,
        folder: "/departments",
      });
      imageUrl = uploaded.url;
      imageFileId = uploaded.fileId;
    }

    // Create new department
    const newDepartment = new Department({
      name,
      email,
      password: hashedPassword,
      state,
      district,
      workingAreas,
      phone,
      whatsapp,
      telephone,
      photo: imageUrl,
      photoFileId: imageFileId,
      isVerified: false,
      verificationOTP: otp,
      otpExpiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    await newDepartment.save();

    // Send OTP email
    await sendEmail(email, 'Verify your VoiceBox Department Account', `Your OTP for verifying your account is: ${otp}\n\nThis OTP is valid for 10 minutes.`);

    res.status(201).json({ message: 'Department registered. Please verify your email.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================== regenrate otp ==================

export const regenerateDeptOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the department exists
    const dept = await Department.findOne({ email });
    if (!dept) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Check if the department is already verified
    if (dept.isVerified) {
      return res.status(400).json({ message: 'Email already verified. Please login.' });
    }

    // Generate a new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    dept.verificationOTP = newOtp;
    dept.otpExpiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes from now
    await dept.save();

    // Send the new OTP via email
    const emailSubject = 'New OTP for Email Verification';
    const emailBody = `Your new OTP for email verification is: ${newOtp}. It will expire in 15 minutes.`;
    await sendEmail(dept.email, emailSubject, emailBody);

    res.json({ message: 'New OTP sent to your email.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to regenerate OTP. Please try again.' });
  }
};





// ==================== Verify Department OTP (Auto-login) ====================
export const verifyDeptOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const dept = await Department.findOne({ email });

    if (!dept) {
      return res.status(404).json({ message: 'Department not found' });
    }

    if (dept.isVerified) {
      return res.status(400).json({ message: 'Email already verified. Please login.' });
    }

    if (!dept || !dept.verificationOTP || !dept.otpExpiresAt) {
      return res.status(400).json({ message: 'No OTP request found. Please signup again.' });
    }

    if (dept.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    if (dept.verificationOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP. Please check and try again.' });
    }

    // If everything okay, mark as verified
    dept.isVerified = true;
    dept.verificationOTP = undefined;
    dept.otpExpiresAt = undefined;
    await dept.save();

    // Generate token
    const token = jwt.sign({ id: dept._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Email verified and logged in successfully',
      token,
      department: {
        id: dept._id,
        name: dept.name,
        email: dept.email,
        photo: dept.photo,
        state: dept.state,
        district: dept.district,
        workingAreas: dept.workingAreas
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==================== Department Signin ====================
export const signinDepartment = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validatePassword(password)) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters, have at least one letter and one number, and only use letters, numbers, or !@#$%^&*.'
      });
    }


    const department = await Department.findOne({ email });

    if (!department) {
      return res.status(400).json({ message: 'Department not found' });
    }
    if (!department.isVerified) {
      return res.status(403).json({ message: 'Please verify your email first' });
    }

    const isMatch = await bcrypt.compare(password, department.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: department._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      department: {
        id: department._id,
        name: department.name,
        email: department.email,
        photo: department.photo,
        state: department.state,
        district: department.district,
        workingAreas: department.workingAreas
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==================== Get Own Department Profile (Private) ====================
export const getDepartmentProfile = async (req, res) => {
  try {
    const departmentId = req.department?._id;

    if (!departmentId) {
      return res.status(400).json({ message: 'Invalid request. Department ID missing.' });
    }

    const departments = await Department.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(departmentId) } },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'department',
          as: 'comments'
        }
      },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: '$comments' }, 0] },
              then: { $avg: '$comments.rating' },
              else: 0
            }
          }
        }
      },
      {
        $project: {
          password: 0,
          verificationOTP: 0,
          otpExpiresAt: 0,
          comments: 0
        }
      }
    ]);

    const department = departments[0];

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.status(200).json(department);
  } catch (err) {
    console.error('Error getting department profile:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};




// ==================== Update Department Profile (Private) ====================

export const updateDepartmentProfile = async (req, res) => {
  try {
    const { name, email, phone, whatsapp, telephone, workingAreas, password, state, district } = req.body;

    if (!req.department) {
      return res.status(401).json({ message: 'Unauthorized. Please login.' });
    }

    const department = await Department.findById(req.department._id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    let emailChanged = false;

    // ===== Handle new photo upload
    if (req.file) {
      // Delete old photo if exists
      if (department.photoFileId) {
        try {
          await imagekit.deleteFile(department.photoFileId);
        } catch (err) {
          console.error("Failed to delete old department image:", err.message);
        }
      }

      // Upload new photo to ImageKit
      const uploaded = await imagekit.upload({
        file: fs.readFileSync(req.file.path),
        fileName: `dept_${department._id}_${Date.now()}${path.extname(req.file.originalname)}`,
        folder: "/departments",
      });

      // Delete local temp file
      fs.unlinkSync(req.file.path);

      // Update department photo fields
      department.photo = uploaded.url;
      department.photoFileId = uploaded.fileId;
    }

    // ===== Prepare fields to update
    let updateFields = {
      name,
      phone,
      whatsapp,
      telephone,
      workingAreas,
      state,
      district,
      photo: department.photo,           // Update photo URL if changed
      photoFileId: department.photoFileId // Update fileId if changed
    };

    // ===== Email change
    if (email && email !== department.email) {
      const existingDept = await Department.findOne({ email });
      if (existingDept) {
        return res.status(400).json({ message: 'New email already in use' });
      }
      updateFields.email = email;
      emailChanged = true;
    }

    // ===== Password change
    if (password) {
      if (!validatePassword(password)) {
        return res.status(400).json({
          message: 'Password must be at least 6 characters, no spaces allowed, and can only contain letters, numbers, and special characters.'
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    // ===== If email changed → generate new OTP
    if (emailChanged) {
      const otp = generateOTP();
      updateFields.isVerified = false;
      updateFields.verificationOTP = otp;
      updateFields.otpExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      await sendEmail(
        email,
        'Verify your New Department Email',
        `Your OTP for verifying your updated department profile is: ${otp}\n\nThis OTP is valid for 10 minutes.`
      );
    }

    // ===== Update the department
    const updatedDepartment = await Department.findByIdAndUpdate(
      department._id,
      updateFields,
      { new: true }
    ).select('-password -verificationOTP -otpExpiresAt');

    res.json({
      message: emailChanged ? 'Profile updated. Please verify your new email.' : 'Profile updated successfully.',
      department: updatedDepartment,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


// ==================== Get Department by ID (Public) ====================
export const getDepartmentById = async (req, res) => {
  try {
    const departments = await Department.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'department',
          as: 'comments'
        }
      },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: '$comments' }, 0] },
              then: { $avg: '$comments.rating' },
              else: 0
            }
          }
        }
      },
      {
        $project: {
          password: 0,
          verificationOTP: 0,
          otpExpiresAt: 0,
          comments: 0
        }
      }
    ]);

    const dept = departments[0];

    if (!dept) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(dept);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==================== Filter & Search Departments (Public) ====================
// ==================== Filter & Search Departments (Public) ====================
export const filterAndSearchDepartments = async (req, res) => {
  try {
    const { state, district, search } = req.query;

    // Prepare the base filter
    let filter = {};
    if (state) filter.state = state;
    if (district) filter.district = district;

    // Use aggregation pipeline to calculate average rating
    let departments = await Department.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'department',
          as: 'comments'
        }
      },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: '$comments' }, 0] },
              then: { $avg: '$comments.rating' },
              else: 0
            }
          }
        }
      },
      {
        $project: {
          password: 0,
          verificationOTP: 0,
          otpExpiresAt: 0,
          comments: 0
        }
      }
    ]);

    // Apply search filter within the current state and district context
    if (search) {
      const regex = new RegExp(search, 'i');
      departments = departments.filter(dept => 
        regex.test(dept.name) || 
        dept.workingAreas.some(area => regex.test(area))
      );
    }

    res.status(200).json(departments);
  } catch (err) {
    console.error('Error in filterAndSearchDepartments:', err);
    res.status(500).json({ error: err.message });
  }
};