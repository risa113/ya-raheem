import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    index: true,
  },
  otpCode: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 300 }, // Automatically delete after 5 minutes (300 seconds)
  },
}, {
  timestamps: true,
});

export const Otp = mongoose.model('Otp', otpSchema);
