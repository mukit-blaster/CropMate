const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');
const User = require('../models/User');
const Booking = require('../models/Booking');
const CropPrediction = require('../models/CropPrediction');
const DiseaseDetection = require('../models/DiseaseDetection');
const KnowledgeTip = require('../models/KnowledgeTip');
const SellItem = require('../models/SellItem');

/**
 * GET /api/admin/test
 * Test endpoint to verify admin routes are working (no auth required for testing)
 */
router.get('/test', (req, res) => {
  console.log('Test endpoint called');
  return res.status(200).json({ 
    message: 'Admin routes are working!', 
    query: req.query,
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/admin/test-auth
 * Test endpoint with admin auth to verify middleware works
 */
router.get('/test-auth', isAdmin, (req, res) => {
  console.log('Test-auth endpoint called, user:', req.user);
  return res.status(200).json({ 
    message: 'Admin auth is working!', 
    user: req.user ? { uid: req.user.uid, email: req.user.email, role: req.user.role } : 'NOT SET',
    query: req.query
  });
});

/**
 * GET /api/admin/stats
 * Get dashboard statistics (admin only)
 */
router.get('/stats', isAdmin, async (req, res) => {
  try {
    console.log('=== ADMIN STATS REQUEST ===');
    console.log('Fetching admin stats...');
    console.log('Request query:', req.query);
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);
    console.log('req.user exists:', !!req.user);
    
    // Safety check for req.user
    if (!req.user || !req.user.uid) {
      console.error('ERROR: req.user is not set by middleware!');
      console.error('This means the middleware did not set req.user properly');
      return res.status(500).json({ 
        message: 'Server error', 
        error: 'User not authenticated properly - req.user is undefined or missing uid'
      });
    }
    
    // Safely log user info
    console.log('Request user:', { 
      _id: req.user._id ? String(req.user._id) : 'N/A',
      uid: req.user.uid || 'N/A', 
      email: req.user.email || 'N/A', 
      role: req.user.role || 'N/A' 
    });
    
    // Use try-catch for each query to identify which one fails
    let totalUsers = 0;
    let totalBookings = 0;
    let pendingBookings = 0;
    let confirmedBookings = 0;
    let completedBookings = 0;
    let totalPredictions = 0;
    let totalDetections = 0;
    let totalKnowledgeTips = 0;
    let totalSellItems = 0;
    let recentUsers = 0;
    let recentBookings = 0;

    try {
      totalUsers = await User.countDocuments();
      console.log('Total users:', totalUsers);
    } catch (err) {
      console.error('Error counting users:', err);
    }

    try {
      totalBookings = await Booking.countDocuments();
      console.log('Total bookings:', totalBookings);
    } catch (err) {
      console.error('Error counting bookings:', err);
    }

    try {
      pendingBookings = await Booking.countDocuments({ status: 'pending' });
      confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
      completedBookings = await Booking.countDocuments({ status: 'completed' });
    } catch (err) {
      console.error('Error counting booking statuses:', err);
    }

    try {
      totalPredictions = await CropPrediction.countDocuments();
      console.log('Total predictions:', totalPredictions);
    } catch (err) {
      console.error('Error counting predictions:', err);
    }

    try {
      totalDetections = await DiseaseDetection.countDocuments();
      console.log('Total detections:', totalDetections);
    } catch (err) {
      console.error('Error counting detections:', err);
    }

    try {
      totalKnowledgeTips = await KnowledgeTip.countDocuments();
      console.log('Total knowledge tips:', totalKnowledgeTips);
    } catch (err) {
      console.error('Error counting knowledge tips:', err);
    }

    try {
      totalSellItems = await SellItem.countDocuments();
      console.log('Total sell items:', totalSellItems);
    } catch (err) {
      console.error('Error counting sell items:', err);
    }

    // Recent activity (last 7 days)
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      recentUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
      recentBookings = await Booking.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    } catch (err) {
      console.error('Error counting recent activity:', err);
    }

    const stats = {
      totalUsers,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      totalPredictions,
      totalDetections,
      totalKnowledgeTips,
      totalSellItems,
      recentUsers,
      recentBookings,
    };

    console.log('Stats calculated:', stats);
    return res.status(200).json({ stats });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      errorName: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * GET /api/admin/users
 * Get all users (admin only)
 */
router.get('/users', isAdmin, async (req, res) => {
  try {
    // Safety check for req.user
    if (!req.user || !req.user.uid) {
      console.error('ERROR: req.user is not set by middleware!');
      return res.status(500).json({ 
        message: 'Server error', 
        error: 'User not authenticated properly - req.user is undefined or missing uid'
      });
    }

    const { page = 1, limit = 50, search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    console.log(`Found ${users.length} users out of ${total} total`);

    return res.status(200).json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * GET /api/admin/bookings
 * Get all bookings (admin only)
 */
router.get('/bookings', isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = status ? { status } : {};

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    return res.status(200).json({
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/admin/predictions
 * Get all crop predictions (admin only)
 */
router.get('/predictions', isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const predictions = await CropPrediction.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await CropPrediction.countDocuments();

    return res.status(200).json({
      predictions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/admin/detections
 * Get all disease detections (admin only)
 */
router.get('/detections', isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const detections = await DiseaseDetection.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await DiseaseDetection.countDocuments();

    return res.status(200).json({
      detections,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching detections:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/admin/knowledge
 * Get all knowledge tips (admin only)
 */
router.get('/knowledge', isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tips = await KnowledgeTip.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await KnowledgeTip.countDocuments();

    return res.status(200).json({
      tips,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching knowledge tips:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * GET /api/admin/sell-items
 * Get all sell items (admin only)
 */
router.get('/sell-items', isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, type = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = type ? { type } : {};

    const items = await SellItem.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SellItem.countDocuments(query);

    return res.status(200).json({
      items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching sell items:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * PUT /api/admin/users/:id/role
 * Update user role (admin only)
 * :id can be either MongoDB _id or Firebase uid
 */
router.put('/users/:id/role', isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;
    
    console.log('Updating user role - id:', id, 'role:', role);
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Try to find by MongoDB _id first, then by Firebase uid
    let user = null;
    try {
      // Try as MongoDB ObjectId
      user = await User.findByIdAndUpdate(
        id,
        { role, updatedAt: new Date() },
        { new: true }
      );
      console.log('Found user by _id:', user ? user.email : 'NOT FOUND');
    } catch (err) {
      // If that fails, try as Firebase uid
      console.log('Not a valid ObjectId, trying as uid...');
      user = await User.findOneAndUpdate(
        { uid: id },
        { role, updatedAt: new Date() },
        { new: true }
      );
      console.log('Found user by uid:', user ? user.email : 'NOT FOUND');
    }

    if (!user) {
      console.error('User not found with id:', id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User role updated successfully:', user.email, '->', user.role);
    return res.status(200).json({ message: 'User role updated', user });
  } catch (error) {
    console.error('Error updating user role:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

module.exports = router;

