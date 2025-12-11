const mongoose = require('mongoose');

const diseaseDetectionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true }, // Firebase uid
  userName: { type: String },
  userEmail: { type: String },
  imageUrl: { type: String },
  analysis: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('DiseaseDetection', diseaseDetectionSchema);

