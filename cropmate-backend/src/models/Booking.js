const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true }, // Firebase uid
  userName: { type: String, required: true },
  userEmail: { type: String },
  userPhone: { type: String, required: true },
  itemId: { type: String, required: true },
  itemName: { type: String, required: true },
  itemType: { type: String, required: true }, // 'machines' or 'labor'
  itemImage: { type: String },
  price: { type: String, required: true },
  bookingDate: { type: Date, required: true }, // When user wants the service
  duration: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);

