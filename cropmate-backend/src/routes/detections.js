const express = require('express');
const router = express.Router();
const DiseaseDetection = require('../models/DiseaseDetection');

/**
 * POST /api/detections
 * Save a disease detection
 */
router.post('/', async (req, res) => {
  try {
    const { userId, userName, userEmail, imageUrl, analysis } = req.body;

    if (!userId || !analysis) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const detection = new DiseaseDetection({
      userId,
      userName,
      userEmail,
      imageUrl,
      analysis,
    });

    await detection.save();
    return res.status(201).json({ message: 'Detection saved', detection });
  } catch (error) {
    console.error('Error saving detection:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/detections/user/:userId
 * Get all detections for a specific user
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const detections = await DiseaseDetection.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json({ detections });
  } catch (error) {
    console.error('Error fetching user detections:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

