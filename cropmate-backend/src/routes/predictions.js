const express = require('express');
const router = express.Router();
const CropPrediction = require('../models/CropPrediction');

/**
 * POST /api/predictions
 * Save a crop prediction
 */
router.post('/', async (req, res) => {
  try {
    const { userId, userName, userEmail, soilType, phLevel, humidity, temperature, prediction } = req.body;

    if (!userId || !soilType || !phLevel || !humidity || !temperature || !prediction) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const cropPrediction = new CropPrediction({
      userId,
      userName,
      userEmail,
      soilType,
      phLevel: parseFloat(phLevel),
      humidity: parseFloat(humidity),
      temperature: parseFloat(temperature),
      prediction,
    });

    await cropPrediction.save();
    return res.status(201).json({ message: 'Prediction saved', prediction: cropPrediction });
  } catch (error) {
    console.error('Error saving prediction:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/predictions/user/:userId
 * Get all predictions for a specific user
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const predictions = await CropPrediction.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json({ predictions });
  } catch (error) {
    console.error('Error fetching user predictions:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

