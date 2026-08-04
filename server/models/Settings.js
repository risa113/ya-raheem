import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  restaurantName: { type: String, default: 'Midnight Fuel' },
  phone: { type: String, default: '+91 90801 39363' },
  address: { type: String, default: 'Bazar, Near Meera Broilers, Melapalayam' },
  landmark: { type: String, default: 'Near Meera Broilers' },
  pincode: { type: String, default: '627005' },
  bookingTime: { type: String, default: '7:00 AM – 2:00 AM' },
  foodAvailableTime: { type: String, default: '7:00 PM – 2:00 AM' },
  openingHour: { type: Number, default: 19 },
  closingHour: { type: Number, default: 2 },
  deliveryCharge: { type: Number, default: 35 },
  minOrderAmount: { type: Number, default: 150 },
  taxPercentage: { type: Number, default: 5 },
  isClosedForced: { type: Boolean, default: false },
  holidayMode: { type: Boolean, default: false },
  allowAnytimeOrdering: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export const Settings = mongoose.model('Settings', settingsSchema);
