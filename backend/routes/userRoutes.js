


import express from 'express';
import { signup, signin, verifyOTP, getProfile, updateProfile, getUserComplaints } from '../controllers/userController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/verify-otp', verifyOTP);
router.post('/signin', signin);
router.get('/profile', authenticateUser, getProfile);
router.put('/profile', authenticateUser, upload.single('photo'), updateProfile);
router.get('/complaints', authenticateUser, getUserComplaints);

export default router;
