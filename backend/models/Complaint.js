import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, unique: true, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  problem: { type: String, required: true },
  phone: String,
  address: String,
}, { timestamps: true });

export default mongoose.model('Complaint', complaintSchema);
