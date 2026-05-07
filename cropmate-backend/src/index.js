require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./db');

const usersRoute = require('./routes/users');
const bookingsRoute = require('./routes/bookings');
const adminRoute = require('./routes/admin');
const predictionsRoute = require('./routes/predictions');
const detectionsRoute = require('./routes/detections');
const knowledgeRoute = require('./routes/knowledge');
const sellRoute = require('./routes/sell');
const aiRoute = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5001;

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    const allowed = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      process.env.CLIENT_ORIGIN,
    ].filter(Boolean);

    if (allowed.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Ensure MongoDB is connected before route handlers run.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB connection error:', err.message);
    res.status(500).json({ message: 'Database connection failed', error: err.message });
  }
});

app.get('/', (req, res) => res.send('CropMate backend up'));
app.get('/api/health', (req, res) =>
  res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: Date.now() })
);

app.use('/api/users', usersRoute);
app.use('/api/bookings', bookingsRoute);
app.use('/api/admin', adminRoute);
app.use('/api/predictions', predictionsRoute);
app.use('/api/detections', detectionsRoute);
app.use('/api/knowledge', knowledgeRoute);
app.use('/api/sell', sellRoute);
app.use('/api/ai', aiRoute);

app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

if (require.main === module) {
  const start = async () => {
    try {
      await connectDB();
      console.log('Connected to MongoDB');
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
      console.error('Startup error:', err.message || err);
      process.exit(1);
    }
  };
  start();
}

module.exports = app;
