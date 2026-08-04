import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  customerName: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  date: { type: String, required: true },
  approved: { type: Boolean, default: true },
  reply: { type: String },
}, {
  timestamps: true,
});

export const Review = mongoose.model('Review', reviewSchema);
