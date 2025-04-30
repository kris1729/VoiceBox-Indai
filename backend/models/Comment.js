import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
});

const commentSchema = new mongoose.Schema({
  complaint: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  text: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  replies: [replySchema],
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);

