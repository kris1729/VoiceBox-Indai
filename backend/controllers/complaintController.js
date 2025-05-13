import Complaint from '../models/Complaint.js';
import Department from '../models/Department.js';
import { generateComplaintId } from '../utils/generateComplaintId.js';
import { sendComplaintEmail } from '../utils/sendComplaintEmail.js';
import { modifyComplaintContent } from '../utils/deepSeekAPI.js';

// **Generate Application Content (Draft)**
export const generateApplicationContent = async (req, res) => {
  try {
    const { problem, address, phone, selectedDepartmentId } = req.body;
    const user = req.user;

    if (!problem || !address || !phone) {
      return res.status(400).json({ error: 'Problem, address, and phone are required.' });
    }

    // Find the selected department
    const department = await Department.findById(selectedDepartmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Generate the English and Hindi applications (No database storage here)
    const englishApplication = await modifyComplaintContent({
      userName: user.name,
      deptName: department.name,
      problem,
      address,
      phone
    }, 'English');

    const hindiApplication = await modifyComplaintContent({
      userName: user.name,
      deptName: department.name,
      problem,
      address,
      phone
    }, 'Hindi');

    // Return the generated content to the frontend without saving
    res.status(200).json({
      message: 'Application content generated successfully.',
      englishApplication,
      hindiApplication
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate application content.' });
  }
};

// **Send Complaint After Review (Final)**
// **Send Complaint After Review (Final Save)**
// **Send Complaint After Review (Final Save)**
export const sendComplaintAfterReview = async (req, res) => {
  try {
    const user = req.user;
    const {
      departmentId,
      problem,
      address,
      phone,
      englishApplication,
      hindiApplication
    } = req.body;

    // Validate required fields
    if (!departmentId || !problem || !address || !phone || !englishApplication || !hindiApplication) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Generate unique complaint ID
    const complaintId = generateComplaintId();

    // Create the final complaint record in the database
    const complaint = new Complaint({
      complaintId,
      user: user._id,
      department: departmentId,
      problem,
      address,
      phone,
      englishApplication,
      hindiApplication,
      status: 'final'
    });

    await complaint.save();

    // Find the department for sending the email
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // **Send the final complaint email**
    await sendComplaintEmail({
      toUser: user.email,
      toDept: department.email,
      userName: user.name,
      deptName: department.name,
      complaintId,
      englishContent: englishApplication,  // This should match exactly
      hindiContent: hindiApplication,      // This should match exactly
      address,
      phone
    });

    res.status(201).json({ message: 'Complaint sent successfully', complaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong while sending the complaint.' });
  }
};

// **Get All Complaints for a Logged-In User**
export const getUserComplaints = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = { user: req.user._id };

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { complaintId: searchRegex },
        { problem: searchRegex },
        { address: searchRegex }
      ];
    }

    const complaints = await Complaint.find(filter).populate('department', 'name');
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching complaints for user.' });
  }
};

// **Get All Complaints for a Department (Department Auth Required)**
export const getDepartmentComplaints = async (req, res) => {
  try {
    const { search } = req.query;
    const filter = { department: req.department._id };

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { complaintId: searchRegex },
        { problem: searchRegex },
        { address: searchRegex }
      ];
    }

    const complaints = await Complaint.find(filter).populate('user', 'name email');
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching complaints for department.' });
  }
};
