const express = require('express');
const WeightEntry = require('../models/WeightEntry');
const auth = require('../middleware/auth');

const router = express.Router();

// Add weight entry
router.post('/', auth, async (req, res) => {
  try {
    const { weight, date } = req.body;

    // Check if entry already exists for this date
    const existingEntry = await WeightEntry.findOne({
      userId: req.user._id,
      date
    });

    if (existingEntry) {
      existingEntry.weight = weight;
      await existingEntry.save();
      return res.json(existingEntry);
    }

    const weightEntry = new WeightEntry({
      userId: req.user._id,
      weight,
      date
    });

    await weightEntry.save();
    res.status(201).json(weightEntry);
  } catch (error) {
    console.error('Add weight entry error:', error);
    res.status(500).json({ message: 'Server error during weight entry creation' });
  }
});

// Get weight entries
router.get('/', auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const entries = await WeightEntry.find({
      userId: req.user._id,
      createdAt: { $gte: startDate }
    }).sort({ date: 1 });

    res.json(entries);
  } catch (error) {
    console.error('Get weight entries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;