require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const usersRoute = require('./routes/users');
const bookingsRoute = require('./routes/bookings');
const adminRoute = require('./routes/admin');
const predictionsRoute = require('./routes/predictions');
const detectionsRoute = require('./routes/detections');
const knowledgeRoute = require('./routes/knowledge');
const sellRoute = require('./routes/sell');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      process.env.CLIENT_ORIGIN
    ].filter(Boolean); // Remove undefined values
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

// Apply CORS middleware globally (this handles preflight requests)
app.use(cors(corsOptions));

app.use(express.json()); // parse JSON bodies

// Routes
app.use('/api/users', usersRoute);
app.use('/api/bookings', bookingsRoute);
app.use('/api/admin', adminRoute);
app.use('/api/predictions', predictionsRoute);
app.use('/api/detections', detectionsRoute);
app.use('/api/knowledge', knowledgeRoute);
app.use('/api/sell', sellRoute);

// Root
app.get('/', (req, res) => res.send('CropMate backend up'));

// Global error handler
app.use((err, req, res, next) => {
  console.error('=== GLOBAL ERROR HANDLER ===');
  console.error('Error:', err);
  console.error('Error message:', err.message);
  console.error('Error stack:', err.stack);
  console.error('Request path:', req.path);
  console.error('Request method:', req.method);
  res.status(err.status || 500).json({
    message: err.message || 'Server error',
    error: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Connect to MongoDB and start server
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
    process.exit(1);
  }
};

start();
