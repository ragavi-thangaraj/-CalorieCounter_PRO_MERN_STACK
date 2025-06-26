const mongoose = require('mongoose');

const foodEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true
  },
  food: {
    type: Object,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0.1
  },
  meal: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true
  },
  date: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
foodEntrySchema.index({ userId: 1, date: 1 });
foodEntrySchema.index({ userId: 1, meal: 1, date: 1 });

module.exports = mongoose.model('FoodEntry', foodEntrySchema);