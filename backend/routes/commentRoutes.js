import express from 'express';
import {
  addComment,
  deleteComment,
  replyToComment,
  deleteReply,
  getCommentsByDepartment
} from '../controllers/commentController.js';
import {
  authenticateUser,
  authenticateDepartment
} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/:departmentId', authenticateUser, addComment);         
         // POST /api/comment/:departmentId

router.delete('/:departmentId/:commentId', authenticateUser, deleteComment);
  // DELETE /api/comment/:departmentId/:commentId


router.post('/reply/:commentId', authenticateDepartment, replyToComment);   
  // POST /api/comment/reply/:commentId


// router.delete('/reply/:commentId/:replyIndex', authenticateDepartment, deleteReply); 
// // DELETE /api/comment/reply/:commentId/:replyIndex


router.get('/:departmentId', getCommentsByDepartment);     
        // GET /api/comment/department/:departmentId



export default router;
