import Complaint from '../models/Complaint.js';
import Department from '../models/Department.js';
import { generateComplaintId } from '../utils/generateComplaintId.js';
import { sendComplaintEmail } from '../utils/sendComplaintEmail.js';

export const raiseComplaint = async (req, res) => {
  try {
    const { problem, phone, address } = req.body;
    const { departmentId } = req.params;

    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized. Please log in.' });

    const department = await Department.findById(departmentId);
    if (!department) return res.status(404).json({ message: 'Department not found' });

    const complaintId = generateComplaintId();

    const complaint = new Complaint({
      complaintId,
      user: user._id,
      department: department._id,
      problem,
      phone,
      address
    });

    await complaint.save();

    await sendComplaintEmail({
      toUser: user.email,
      toDept: department.email,
      userName: user.name,
      deptName: department.name,
      complaintId,
      problem,
      address,
      phone
    });

    res.status(201).json({ message: 'Complaint raised successfully', complaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong while raising the complaint.' });
  }
};


// Get all complaints for a logged-in user
export const getUserComplaints = async (req, res) => {
  try {
    const { search } = req.query;

    const filter = { user: req.user._id };

    if (search) {
      const searchRegex = new RegExp(search, 'i'); // case-insensitive
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


// Get all complaints for a department (department must be logged in)
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
