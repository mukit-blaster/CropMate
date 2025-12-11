const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

/**
 * POST /api/bookings
 * Create a new booking
 */
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      userPhone,
      itemId,
      itemName,
      itemType,
      itemImage,
      price,
      bookingDate,
      duration,
    } = req.body;

    if (!userId || !userName || !userPhone || !itemId || !itemName || !itemType || !price || !bookingDate || !duration) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const booking = new Booking({
      userId,
      userName,
      userEmail,
      userPhone,
      itemId,
      itemName,
      itemType,
      itemImage,
      price,
      bookingDate: new Date(bookingDate),
      duration,
      status: 'pending',
    });

    await booking.save();
    return res.status(201).json({ message: 'Booking created', booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/bookings/user/:userId
 * Get all bookings for a specific user
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/bookings/:id
 * Get a single booking by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    return res.status(200).json({ booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PUT /api/bookings/:id
 * Update booking status
 */
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (status && !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    return res.status(200).json({ message: 'Booking updated', booking });
  } catch (error) {
    console.error('Error updating booking:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * DELETE /api/bookings/:id
 * Delete a booking
 */
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    return res.status(200).json({ message: 'Booking deleted' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

