import express from 'express';
import {
  addComment,
  deleteComment,
  replyToComment,
  getCommentsByDepartment
} from '../controllers/commentController.js';

import { authenticateUser, authenticateDepartment } from '../middlewares/authMiddleware.js';

const router = express.Router();

// User adds a comment (review) to a department via complaint ID
router.post('/', authenticateUser, addComment);

// User deletes their own comment
router.delete('/:commentId', authenticateUser, deleteComment);

// Department replies to a specific comment (one-time reply)
router.post('/reply/:commentId', authenticateDepartment, replyToComment);

// Public or logged-in users can view all comments for a specific department
router.get('/department/:departmentId', getCommentsByDepartment);

export default router;

