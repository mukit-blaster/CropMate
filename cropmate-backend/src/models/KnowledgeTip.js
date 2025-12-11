const mongoose = require('mongoose');

const knowledgeTipSchema = new mongoose.Schema({
  category: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  readTime: { type: String, required: true },
  image: { type: String, required: true },
  short: { type: String, required: true },
  full: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('KnowledgeTip', knowledgeTipSchema);

