import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  offerPrice: { type: Number },
  image: { type: String, required: true },
  availability: { type: Boolean, default: true },
  stock: { type: Number, default: 20 },
  isVeg: { type: Boolean, default: false },
  popularBadge: { type: Boolean, default: false },
  spicyLevel: { type: Number, default: 1 },
  prepTime: { type: String, default: '20 mins' },
  featured: { type: Boolean, default: false },
  rating: { type: Number, default: 4.8 },
  reviewsCount: { type: Number, default: 12 },
}, {
  timestamps: true,
});

export const Product = mongoose.model('Product', productSchema);
