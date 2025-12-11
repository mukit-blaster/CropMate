const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * POST /api/users
 * Save or update a user profile from frontend (upsert by uid)
 * Body expected:
 * { uid, name, email, photoURL, provider, role }
 */
router.post('/', async (req, res) => {
  try {
    const { uid, name, email, photoURL, provider, role } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ message: 'uid and email are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ uid });
    
    // Auto-assign admin role for admin@gmail.com or adminadmin@gmail.com
    const isAdminEmail = email.toLowerCase() === 'admin@gmail.com' || email.toLowerCase() === 'adminadmin@gmail.com';
    
    // Preserve existing admin role, or assign based on email, or use provided role, or default to 'user'
    let finalRole = 'user';
    if (existingUser && existingUser.role === 'admin') {
      // Preserve existing admin role
      finalRole = 'admin';
      console.log('Preserving existing admin role for user:', email);
    } else if (role === 'admin') {
      // Use provided admin role
      finalRole = 'admin';
    } else if (isAdminEmail) {
      // Auto-assign admin for admin emails
      finalRole = 'admin';
      console.log('Auto-assigning admin role for email:', email);
    } else if (role) {
      // Use provided role
      finalRole = role;
    }

    const update = {
      uid,
      name,
      email,
      photoURL,
      provider: provider || 'firebase',
      role: finalRole,
      updatedAt: new Date(),
    };

    // upsert: if user with uid exists update it, otherwise create
    // IMPORTANT: Always set role in $set to preserve admin role
    const user = await User.findOneAndUpdate(
      { uid },
      { 
        $set: update  // This includes role, so admin role will be preserved
      },
      { 
        new: true, 
        upsert: true,
        setDefaultsOnInsert: true 
      }
    );

    return res.status(200).json({ message: 'User saved', user });
  } catch (error) {
    console.error('Error saving user:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/users/:uid
 * Get user by Firebase uid
 */
router.get('/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ uid });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
