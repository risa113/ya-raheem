import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  image: { type: String, required: true },
  badge: { type: String, required: true },
  categoryLink: { type: String },
  active: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export const Banner = mongoose.model('Banner', bannerSchema);
