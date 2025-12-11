const mongoose = require('mongoose');

const sellItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // 'medicine' or 'seeds'
  itemType: { type: String, required: true }, // e.g., 'FUNGICIDE', 'RICE SEED'
  price: { type: String, required: true },
  rating: { type: Number, default: 0 },
  available: { type: Boolean, default: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('SellItem', sellItemSchema);

