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


export const sendComplaintAfterReview = async (req, res) => {
  try {
    const user = req.user;
    const { departmentId, problem, address, phone, englishApplication, hindiApplication } = req.body;

    if (!departmentId || !problem || !address || !phone || !englishApplication || !hindiApplication) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Handle photo upload
    let photoUrl = '';
    let photoFileId = '';
    if (req.file) {
      const uploaded = await imagekit.upload({
        file: fs.readFileSync(req.file.path),
        fileName: `complaint_${user._id}_${Date.now()}${path.extname(req.file.originalname)}`,
        folder: "/complaints",
      });

      fs.unlinkSync(req.file.path);
      photoUrl = uploaded.url;
      photoFileId = uploaded.fileId;
    }

    const complaintId = generateComplaintId();
    const complaint = new Complaint({
      complaintId,
      user: user._id,
      department: departmentId,
      problem,
      address,
      phone,
      englishApplication,
      hindiApplication,
      photo: photoUrl,
      photoFileId: photoFileId,
      status: 'final'
    });

    await complaint.save();

    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    await sendComplaintEmail({
      toUser: user.email,
      toDept: department.email,
      userName: user.name,
      deptName: department.name,
      complaintId,
      englishContent: englishApplication,
      hindiContent: hindiApplication,
      address,
      phone
    });

    res.status(201).json({ message: 'Complaint sent successfully', complaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong while sending the complaint.' });
  }
};






// delte complain by user private 
export const deleteComplaint = async (req, res) => {
  try {
    const user = req.user;
    const { complaintId } = req.params;

    const complaint = await Complaint.findOne({ complaintId, user: user._id });
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found or you do not have permission to delete it.' });
    }

    // Delete the photo from ImageKit if exists
    if (complaint.photoFileId) {
      try {
        await imagekit.deleteFile(complaint.photoFileId);
      } catch (err) {
        console.error("Failed to delete complaint photo from ImageKit:", err.message);
      }
    }

    // Delete the complaint from the database
    await complaint.deleteOne();

    res.json({ message: 'Complaint deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong while deleting the complaint.' });
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

    const complaints = await Complaint.find(filter).populate('user', 'name email photo');
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching complaints for department.' });
  }
};
