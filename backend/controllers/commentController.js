import Comment from '../models/Comment.js';
import Complaint from '../models/Complaint.js';

// User adds a comment to a department via a complaint
export const addComment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { complaintId, text, rating } = req.body;

    const complaint = await Complaint.findOne({ complaintId }).populate('department');
    if (!complaint || String(complaint.department._id) !== departmentId) {
      return res.status(404).json({ message: 'Complaint not found for this department.' });
    }

    const existing = await Comment.findOne({
      complaint: complaint._id,
      user: req.user._id,
    });

    if (existing) {
      return res.status(400).json({ message: 'You have already commented on this complaint.' });
    }

    const comment = new Comment({
      complaint: complaint._id,
      user: req.user._id,
      department: departmentId,
      text,
      rating,
    });

    await comment.save();
    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User deletes their own comment
export const deleteComment = async (req, res) => {
  try {
    const { departmentId, commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (
      String(comment.user) !== String(req.user._id) ||
      String(comment.department) !== departmentId
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(commentId);
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Department replies to a comment
export const replyToComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { replyText } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (String(comment.department) !== String(req.department._id)) {
      return res.status(403).json({ message: 'Not authorized to reply to this comment' });
    }

    const alreadyReplied = comment.replies.some(
      (reply) => String(reply.department) === String(req.department._id)
    );

    if (alreadyReplied) {
      return res.status(400).json({ message: 'You have already replied to this comment' });
    }

    comment.replies.push({ text: replyText, department: req.department._id });
    await comment.save();

    res.status(200).json({ message: 'Reply added successfully', comment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Department deletes their replyc
export const deleteReply = async (req, res) => {
  try {
    const { commentId, replyIndex } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const reply = comment.replies[replyIndex];
    if (!reply || String(reply.department) !== String(req.department._id)) {
      return res.status(403).json({ message: 'Not authorized to delete this reply' });
    }

    comment.replies.splice(replyIndex, 1);
    await comment.save();

    res.json({ message: 'Reply deleted successfully', comment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all comments for a specific department (public)
export const getCommentsByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const comments = await Comment.find({ department: departmentId })
      .populate('user', 'name')
      .populate('replies.department', 'name');

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
