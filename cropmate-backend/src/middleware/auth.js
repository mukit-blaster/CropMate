const User = require('../models/User');

/**
 * Middleware to verify admin role
 * Expects userId in request body or query
 */
const isAdmin = async (req, res, next) => {
  try {
    console.log('=== ADMIN MIDDLEWARE CALLED ===');
    const userId = req.body?.userId || req.query?.userId;
    
    console.log('Admin middleware - userId:', userId);
    console.log('Admin middleware - query params:', req.query);
    console.log('Admin middleware - body:', req.body);
    console.log('Admin middleware - method:', req.method);
    console.log('Admin middleware - path:', req.path);
    
    if (!userId) {
      console.error('Admin middleware - No userId provided');
      return res.status(401).json({ 
        message: 'User ID required',
        error: 'userId is required in query parameters or request body'
      });
    }

    console.log('Admin middleware - Looking up user with uid:', userId);
    const user = await User.findOne({ uid: userId });
    console.log('Admin middleware - Found user:', user ? { uid: user.uid, email: user.email, role: user.role } : 'NOT FOUND');
    
    if (!user) {
      console.error('Admin middleware - User not found in database');
      return res.status(404).json({ 
        message: 'User not found',
        error: `No user found with uid: ${userId}`
      });
    }

    console.log('Admin middleware - User role:', user.role);
    if (user.role !== 'admin') {
      console.warn('Admin middleware - User is not admin. Role:', user.role);
      return res.status(403).json({ 
        message: 'Admin access required',
        error: `User role '${user.role}' does not have admin access`
      });
    }

    console.log('Admin middleware - Access granted, proceeding to route handler');
    // Ensure req.user is properly set with all necessary fields
    req.user = {
      _id: user._id,
      uid: user.uid,
      email: user.email,
      name: user.name,
      role: user.role,
      photoURL: user.photoURL,
      provider: user.provider,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      // Also set userId for backward compatibility
      userId: user.uid
    };
    console.log('Admin middleware - req.user set:', { uid: req.user.uid, email: req.user.email, role: req.user.role });
    next();
  } catch (error) {
    console.error('=== ADMIN MIDDLEWARE ERROR ===');
    console.error('Auth middleware error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      message: 'Server error',
      error: error.message || 'Unknown error occurred',
      errorName: error.name || 'Error'
    });
  }
};

module.exports = { isAdmin };

