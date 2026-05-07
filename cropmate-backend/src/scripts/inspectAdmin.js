// Quick diagnostic: list all users and confirm role.
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({}, { uid: 1, email: 1, name: 1, role: 1, createdAt: 1 }).sort({ createdAt: -1 });
    console.log(`Found ${users.length} user(s):\n`);
    for (const u of users) {
      console.log(`- ${u.email}  role=${u.role}  uid=${u.uid}  name=${u.name}`);
    }
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await mongoose.disconnect();
  }
})();
