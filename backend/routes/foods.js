const express = require('express');
const Food = require('../models/Food');
const FoodEntry = require('../models/FoodEntry');
const auth = require('../middleware/auth');

const router = express.Router();

// --- ENTRIES ROUTES FIRST ---
// Add food entry
router.post('/entries', auth, async (req, res) => {
  try {
    const entry = new FoodEntry({ ...req.body, userId: req.user._id });
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    console.error('Add food entry error:', error);
    res.status(500).json({ message: 'Server error during food entry creation' });
  }
});

// Get food entries
router.get('/entries', auth, async (req, res) => {
  try {
    const { date } = req.query;
    const query = { userId: req.user._id };
    if (date) query.date = date;
    const entries = await FoodEntry.find(query).sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    console.error('Get food entries error:', error);
    res.status(500).json({ message: 'Server error during food entries fetch' });
  }
});

// Update food entry
router.put('/entries/:id', auth, async (req, res) => {
  try {
    const entry = await FoodEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json(entry);
  } catch (error) {
    console.error('Update food entry error:', error);
    res.status(500).json({ message: 'Server error during food entry update' });
  }
});

// Delete food entry
router.delete('/entries/:id', auth, async (req, res) => {
  try {
    const entry = await FoodEntry.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Entry deleted' });
  } catch (error) {
    console.error('Delete food entry error:', error);
    res.status(500).json({ message: 'Server error during food entry deletion' });
  }
});

// --- OTHER ROUTES ---
// Search foods
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json([]);
    }
    // Try text search first
    let foods = await Food.find({ $text: { $search: q } }).limit(20);
    // If no results, try case-insensitive partial match
    if (!foods.length) {
      foods = await Food.find({ name: { $regex: q, $options: 'i' } }).limit(20);
    }
    res.json(foods);
  } catch (error) {
    console.error('Food search error:', error);
    res.status(500).json({ message: 'Server error during food search' });
  }
});

// Get food by ID (should be last)
router.get('/:id', auth, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.json(food);
  } catch (error) {
    console.error('Get food error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;