const mongoose = require('mongoose');

const cropPredictionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true }, // Firebase uid
  userName: { type: String },
  userEmail: { type: String },
  soilType: { type: String, required: true },
  phLevel: { type: Number, required: true },
  humidity: { type: Number, required: true },
  temperature: { type: Number, required: true },
  prediction: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('CropPrediction', cropPredictionSchema);

