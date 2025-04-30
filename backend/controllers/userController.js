import User from '../models/User.js';
import Complaint from '../models/Complaint.js';
import imagekit from '../utils/imagekit.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';
import generateOTP from '../utils/generateOTP.js';
import fs from 'fs';
import path from 'path';


const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{6,}$/;
  return passwordRegex.test(password);
};


// ==================== Signup ====================
export const signup = async (req, res) => {
  try {
    const { name, email, password, state, district } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    // Password validation

    if (!validatePassword(password)) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters, have at least one letter and one number, and only use letters, numbers, or !@#$%^&*.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    // Optional profile photo
    let imageUrl = null;
    let imageFileId = null;

    if (req.file) {
      const uploaded = await imagekit.upload({
        file: req.file.buffer,
        fileName: `user_${email}_${Date.now()}.jpg`,
        folder: "/users",
      });
      imageUrl = uploaded.url;
      imageFileId = uploaded.fileId;
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      state,
      district,
      isVerified: false,
      verificationOTP: otp,
      otpExpiresAt: Date.now() + 10 * 60 * 1000,
      photo: imageUrl,
      photoFileId: imageFileId,
    });

    await newUser.save();

    await sendEmail(
      email,
      'Verify your VoiceBox account',
      `Your OTP for verifying your account is: ${otp}\n\nThis OTP is valid for 10 minutes.`
    );

    res.status(201).json({ message: 'Signup successful. Please verify your email.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// ==================== Verify OTP and Auto-login ====================
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.verificationOTP || !user.otpExpiresAt) {
      return res.status(400).json({ message: 'No OTP request found. Please signup again.' });
    }

    if (user.isVerified) return res.status(400).json({ message: 'Already verified' });

    if (user.verificationOTP !== otp || user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.verificationOTP = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Email verified and logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        state: user.state,
        district: user.district,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==================== Signin ====================
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validatePassword(password)) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters, have at least one letter and one number, and only use letters, numbers, or !@#$%^&*.'
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email first' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        state: user.state,
        district: user.district,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==================== Get Profile ====================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==================== Update Profile ====================

export const updateProfile = async (req, res) => {
  try {
    const { name, email, password, state, district } = req.body;

    if (!req.user.isVerified) {
      return res.status(403).json({ message: 'Email not verified' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let emailChanged = false;

    // ===== Handle new photo upload
    if (req.file) {
      // Delete old photo if exists
      if (user.photoFileId) {
        try {
          await imagekit.deleteFile(user.photoFileId);
        } catch (err) {
          console.warn("Failed to delete old image:", err.message);
        }
      }

      // Upload new photo to ImageKit
      const uploaded = await imagekit.upload({
        file: fs.readFileSync(req.file.path),
        fileName: `user_${user._id}_${Date.now()}${path.extname(req.file.originalname)}`,
        folder: "/users",
      });

      // Delete the local file after uploading
      fs.unlinkSync(req.file.path);

      // Update user photo fields
      user.photo = uploaded.url;
      user.photoFileId = uploaded.fileId;
    }

    // ===== Prepare fields to update
    let updateFields = {
      name,
      state,
      district,
      photo: user.photo,           // Update photo URL if changed
      photoFileId: user.photoFileId // Update fileId if changed
    };

    // ===== Email change
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'New email already in use' });
      }
      updateFields.email = email;
      emailChanged = true;
    }

    // ===== Password change
    if (password) {
      if (!validatePassword(password)) {
        return res.status(400).json({ message: 'Password must be at least 6 characters, no spaces allowed, and can only contain letters, numbers, and special characters.' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    // ===== If email changed, set new OTP
    if (emailChanged) {
      const newOTP = generateOTP();
      updateFields.isVerified = false;
      updateFields.verificationOTP = newOTP;
      updateFields.otpExpiresAt = Date.now() + 10 * 60 * 1000;

      await sendEmail(
        email,
        'Verify your New Email',
        `Your new OTP for verifying your updated profile is: ${newOTP}\n\nThis OTP is valid for 10 minutes.`
      );
    }

    // ===== Update the user
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      updateFields,
      { new: true }
    ).select('-password -verificationOTP -otpExpiresAt');

    res.json({
      message: emailChanged ? 'Profile updated. Please verify your new email.' : 'Profile updated successfully.',
      user: updatedUser
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== Get Complaints Raised by User ====================
export const getUserComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id }).populate("department", "name");
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
