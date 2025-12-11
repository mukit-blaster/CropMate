const express = require('express');
const router = express.Router();
const KnowledgeTip = require('../models/KnowledgeTip');

/**
 * POST /api/knowledge
 * Create a new knowledge tip
 */
router.post('/', async (req, res) => {
  try {
    const { category, title, date, readTime, image, short, full } = req.body;

    if (!category || !title || !date || !readTime || !image || !short || !full) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const tip = new KnowledgeTip({
      category,
      title,
      date,
      readTime,
      image,
      short,
      full,
    });

    await tip.save();
    return res.status(201).json({ message: 'Knowledge tip created', tip });
  } catch (error) {
    console.error('Error creating knowledge tip:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * GET /api/knowledge
 * Get all knowledge tips with optional filtering
 */
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let query = {};
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { short: { $regex: search, $options: 'i' } },
        { full: { $regex: search, $options: 'i' } },
      ];
    }

    const tips = await KnowledgeTip.find(query)
      .sort({ createdAt: -1 });

    return res.status(200).json({ tips });
  } catch (error) {
    console.error('Error fetching knowledge tips:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * GET /api/knowledge/:id
 * Get a specific knowledge tip
 */
router.get('/:id', async (req, res) => {
  try {
    const tip = await KnowledgeTip.findById(req.params.id);
    
    if (!tip) {
      return res.status(404).json({ message: 'Knowledge tip not found' });
    }

    return res.status(200).json({ tip });
  } catch (error) {
    console.error('Error fetching knowledge tip:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * PUT /api/knowledge/:id
 * Update a knowledge tip
 */
router.put('/:id', async (req, res) => {
  try {
    const tip = await KnowledgeTip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!tip) {
      return res.status(404).json({ message: 'Knowledge tip not found' });
    }

    return res.status(200).json({ message: 'Knowledge tip updated', tip });
  } catch (error) {
    console.error('Error updating knowledge tip:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * DELETE /api/knowledge/:id
 * Delete a knowledge tip
 */
router.delete('/:id', async (req, res) => {
  try {
    const tip = await KnowledgeTip.findByIdAndDelete(req.params.id);

    if (!tip) {
      return res.status(404).json({ message: 'Knowledge tip not found' });
    }

    return res.status(200).json({ message: 'Knowledge tip deleted' });
  } catch (error) {
    console.error('Error deleting knowledge tip:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

