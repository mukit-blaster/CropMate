const express = require('express');
const router = express.Router();
const SellItem = require('../models/SellItem');

/**
 * POST /api/sell
 * Create a new sell item (medicine or seed)
 */
router.post('/', async (req, res) => {
  try {
    const { name, type, itemType, price, rating, available, location, image, description } = req.body;

    if (!name || !type || !itemType || !price || !location || !image) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const item = new SellItem({
      name,
      type, // 'medicine' or 'seeds'
      itemType, // e.g., 'FUNGICIDE', 'RICE SEED'
      price,
      rating: rating || 0,
      available: available !== undefined ? available : true,
      location,
      image,
      description: description || '',
    });

    await item.save();
    return res.status(201).json({ message: 'Sell item created', item });
  } catch (error) {
    console.error('Error creating sell item:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * GET /api/sell
 * Get all sell items with optional filtering
 */
router.get('/', async (req, res) => {
  try {
    const { type, search, available } = req.query;
    
    let query = {};
    
    if (type) {
      query.type = type; // 'medicine' or 'seeds'
    }
    
    if (available !== undefined) {
      query.available = available === 'true';
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { itemType: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await SellItem.find(query)
      .sort({ createdAt: -1 });

    return res.status(200).json({ items });
  } catch (error) {
    console.error('Error fetching sell items:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * GET /api/sell/:id
 * Get a specific sell item
 */
router.get('/:id', async (req, res) => {
  try {
    const item = await SellItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Sell item not found' });
    }

    return res.status(200).json({ item });
  } catch (error) {
    console.error('Error fetching sell item:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * PUT /api/sell/:id
 * Update a sell item
 */
router.put('/:id', async (req, res) => {
  try {
    const item = await SellItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: 'Sell item not found' });
    }

    return res.status(200).json({ message: 'Sell item updated', item });
  } catch (error) {
    console.error('Error updating sell item:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * DELETE /api/sell/:id
 * Delete a sell item
 */
router.delete('/:id', async (req, res) => {
  try {
    const item = await SellItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Sell item not found' });
    }

    return res.status(200).json({ message: 'Sell item deleted' });
  } catch (error) {
    console.error('Error deleting sell item:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

