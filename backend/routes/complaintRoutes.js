import express from 'express';
import {
 
  getUserComplaints,
  getDepartmentComplaints,
 
  generateApplicationContent,
  sendComplaintAfterReview
} from '../controllers/complaintController.js';
import { authenticateUser, authenticateDepartment } from '../middlewares/authMiddleware.js';

const router = express.Router();

// **Raise a Complaint (User Auth Required)**
router.post('/generate-application', authenticateUser, generateApplicationContent);



// **Send Complaint After Review (User Auth Required)**
router.post('/send-complaint', authenticateUser, sendComplaintAfterReview);

// **Get All Complaints for a User (User Auth Required)**
router.get('/user', authenticateUser, getUserComplaints);

// **Get All Complaints for a Department (Department Auth Required)**
router.get('/department', authenticateDepartment, getDepartmentComplaints);

export default router;
