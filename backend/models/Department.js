import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  workingAreas: { type: [String], required: true },
  password: { type: String, required: true },

  isVerified: { type: Boolean, default: false },

  // ✅ Add these fields for OTP verification
  verificationOTP: { type: Number },
  otpExpiresAt: { type: Date },
  photoFileId: { type: String },
  phone: { type: String },
  whatsapp: { type: String },
  telephone: { type: String },
  photo: { type: String },
  
}, { timestamps: true });

departmentSchema.methods.replyToComment = async function (commentId, replyText) {
  const Comment = mongoose.model('Comment');
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }

  // Create reply for the department
  comment.reply = { text: replyText, department: this._id };
  await comment.save();
  return comment;
};

export default mongoose.model('Department', departmentSchema);
