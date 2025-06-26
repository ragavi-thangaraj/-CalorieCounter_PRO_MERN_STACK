const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  caloriesPerMinute: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for text search
exerciseSchema.index({ name: 'text', category: 'text' });

module.exports = mongoose.model('Exercise', exerciseSchema);