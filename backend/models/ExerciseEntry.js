const mongoose = require('mongoose');

const exerciseEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  exercise: {
    type: Object,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  caloriesBurned: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
exerciseEntrySchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('ExerciseEntry', exerciseEntrySchema);