import express from 'express';
import {
  signupDepartment,
  signinDepartment,
  verifyDeptOTP,
  getDepartmentById,
  updateDepartmentProfile,
  getDepartmentProfile,
  filterAndSearchDepartments,
} from '../controllers/departmentController.js';
import { authenticateDepartment } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Department Signup
router.post('/signup', signupDepartment);

// Department Email OTP Verification
router.post('/verify-otp', verifyDeptOTP);

// Department Signin
router.post('/signin', signinDepartment);

// Get Department profile (private)
router.get('/profile', authenticateDepartment, getDepartmentProfile);

// Update Department Profile (private)
router.put('/profile', authenticateDepartment, upload.single('photo'), updateDepartmentProfile);

// Filter and Search Departments
router.get('/search', filterAndSearchDepartments);

// Get Department by ID (public) → moved last
router.get('/:id', getDepartmentById);

export default router;
