const mongoose = require('mongoose');

const weightEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weight: {
    type: Number,
    required: true,
    min: 20,
    max: 500
  },
  date: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
weightEntrySchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('WeightEntry', weightEntrySchema);