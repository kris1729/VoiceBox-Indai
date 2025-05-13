import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  problem: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  englishApplication: { type: String },
  hindiApplication: { type: String },
  status: { type: String, default: 'draft' },  // Add this to track whether the complaint is final or draft
}, { timestamps: true });

export default mongoose.model('Complaint', complaintSchema);
