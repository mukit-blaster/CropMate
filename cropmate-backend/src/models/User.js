const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // Firebase uid
  name: { type: String },
  email: { type: String, required: true, index: true },
  photoURL: { type: String },
  provider: { type: String, default: 'firebase' }, // firebase, google, etc.
  role: { type: String, default: 'user' }, // optional
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
