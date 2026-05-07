// Promote (or demote) a user by email.
// Usage:
//   node src/scripts/promoteUser.js <email> [admin|user]
// Examples:
//   node src/scripts/promoteUser.js admin5@gmail.com admin
//   node src/scripts/promoteUser.js admin5@gmail.com user

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
  const email = (process.argv[2] || '').toLowerCase().trim();
  const role = (process.argv[3] || 'admin').toLowerCase().trim();

  if (!email) {
    console.error('Usage: node src/scripts/promoteUser.js <email> [admin|user]');
    process.exit(1);
  }
  if (!['admin', 'user'].includes(role)) {
    console.error(`Invalid role: ${role}. Use "admin" or "user".`);
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOneAndUpdate(
      { email: { $regex: `^${email}$`, $options: 'i' } },
      { $set: { role, updatedAt: new Date() } },
      { new: true }
    );
    if (!user) {
      console.error(`No user found with email "${email}".`);
      process.exit(1);
    }
    console.log(`Updated: ${user.email} -> role=${user.role}`);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
})();
