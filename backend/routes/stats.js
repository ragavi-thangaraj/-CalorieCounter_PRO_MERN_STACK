const express = require('express');
const FoodEntry = require('../models/FoodEntry');
const ExerciseEntry = require('../models/ExerciseEntry');
const auth = require('../middleware/auth');

const router = express.Router();

// Get daily stats
router.get('/daily', auth, async (req, res) => {
  try {
    const { date } = req.query;
    
    // Get food entries for the date
    const foodEntries = await FoodEntry.find({
      userId: req.user._id,
      date
    });

    // Get exercise entries for the date
    const exerciseEntries = await ExerciseEntry.find({
      userId: req.user._id,
      date
    });

    // Calculate totals
    let totalCaloriesConsumed = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;
    let fiber = 0;

    foodEntries.forEach(entry => {
      const multiplier = entry.quantity;
      totalCaloriesConsumed += entry.food.calories * multiplier;
      protein += entry.food.protein * multiplier;
      carbs += entry.food.carbs * multiplier;
      fat += entry.food.fat * multiplier;
      fiber += (entry.food.fiber || 0) * multiplier;
    });

    const totalCaloriesBurned = exerciseEntries.reduce((total, entry) => {
      return total + entry.caloriesBurned;
    }, 0);

    const netCalories = totalCaloriesConsumed - totalCaloriesBurned;

    const stats = {
      date,
      totalCaloriesConsumed: Math.round(totalCaloriesConsumed),
      totalCaloriesBurned: Math.round(totalCaloriesBurned),
      netCalories: Math.round(netCalories),
      protein: Math.round(protein * 10) / 10,
      carbs: Math.round(carbs * 10) / 10,
      fat: Math.round(fat * 10) / 10,
      fiber: Math.round(fiber * 10) / 10,
      waterIntake: 0 // Placeholder for future implementation
    };

    res.json(stats);
  } catch (error) {
    console.error('Get daily stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get weekly stats
router.get('/weekly', auth, async (req, res) => {
  try {
    const { startDate } = req.query;
    const start = new Date(startDate);
    const dates = [];
    
    // Generate 7 dates starting from startDate
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }

    const weeklyStats = [];

    for (const date of dates) {
      // Get food entries for the date
      const foodEntries = await FoodEntry.find({
        userId: req.user._id,
        date
      });

      // Get exercise entries for the date
      const exerciseEntries = await ExerciseEntry.find({
        userId: req.user._id,
        date
      });

      // Calculate totals
      let totalCaloriesConsumed = 0;
      let protein = 0;
      let carbs = 0;
      let fat = 0;

      foodEntries.forEach(entry => {
        const multiplier = entry.quantity;
        totalCaloriesConsumed += entry.food.calories * multiplier;
        protein += entry.food.protein * multiplier;
        carbs += entry.food.carbs * multiplier;
        fat += entry.food.fat * multiplier;
      });

      const totalCaloriesBurned = exerciseEntries.reduce((total, entry) => {
        return total + entry.caloriesBurned;
      }, 0);

      weeklyStats.push({
        date,
        totalCaloriesConsumed: Math.round(totalCaloriesConsumed),
        totalCaloriesBurned: Math.round(totalCaloriesBurned),
        netCalories: Math.round(totalCaloriesConsumed - totalCaloriesBurned),
        protein: Math.round(protein * 10) / 10,
        carbs: Math.round(carbs * 10) / 10,
        fat: Math.round(fat * 10) / 10,
        fiber: 0,
        waterIntake: 0
      });
    }

    res.json(weeklyStats);
  } catch (error) {
    console.error('Get weekly stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;