import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customer: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    altPhone: String,
    address: { type: String, required: true },
    area: { type: String, required: true },
    landmark: String,
    pincode: { type: String, required: true },
    location: {
      lat: Number,
      lng: Number,
    },
    notes: String,
  },
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    notes: String,
  }],
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  orderTime: {
    type: String,
    default: () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
  estimatedTime: {
    type: String,
    default: '25-35 mins',
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'ONLINE_RAZORPAY'],
    required: true,
  },
  subtotal: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 35 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  couponCode: String,
  paid: { type: Boolean, default: false },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
}, {
  timestamps: true,
});

export const Order = mongoose.model('Order', orderSchema);
