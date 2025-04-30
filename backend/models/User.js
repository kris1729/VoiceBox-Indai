import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    photo: { type: String },
    photoFileId: { type: String },
    isVerified: { type: Boolean, default: false },

    // ✅ OTP fields for verification
    verificationOTP: { type: Number },
    otpExpiresAt: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
