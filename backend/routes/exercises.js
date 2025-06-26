const express = require('express');
const Exercise = require('../models/Exercise');
const ExerciseEntry = require('../models/ExerciseEntry');
const auth = require('../middleware/auth');

const router = express.Router();

// Search exercises
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json([]);
    }

    const exercises = await Exercise.find({
      $text: { $search: q }
    }).limit(20);

    res.json(exercises);
  } catch (error) {
    console.error('Exercise search error:', error);
    res.status(500).json({ message: 'Server error during exercise search' });
  }
});

// Add exercise entry
router.post('/entries', auth, async (req, res) => {
  try {
    const { exerciseId, exercise, duration, caloriesBurned, date } = req.body;

    const exerciseEntry = new ExerciseEntry({
      userId: req.user._id,
      exerciseId,
      exercise,
      duration,
      caloriesBurned,
      date
    });

    await exerciseEntry.save();
    res.status(201).json(exerciseEntry);
  } catch (error) {
    console.error('Add exercise entry error:', error);
    res.status(500).json({ message: 'Server error during exercise entry creation' });
  }
});

// Get exercise entries
router.get('/entries', auth, async (req, res) => {
  try {
    const { date } = req.query;
    
    const entries = await ExerciseEntry.find({
      userId: req.user._id,
      date
    }).sort({ createdAt: -1 });

    res.json(entries);
  } catch (error) {
    console.error('Get exercise entries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete exercise entry
router.delete('/entries/:id', auth, async (req, res) => {
  try {
    const entry = await ExerciseEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!entry) {
      return res.status(404).json({ message: 'Exercise entry not found' });
    }

    res.json({ message: 'Exercise entry deleted successfully' });
  } catch (error) {
    console.error('Delete exercise entry error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;