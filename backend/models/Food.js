const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  calories: {
    type: Number,
    required: true,
    min: 0
  },
  protein: {
    type: Number,
    required: true,
    min: 0
  },
  carbs: {
    type: Number,
    required: true,
    min: 0
  },
  fat: {
    type: Number,
    required: true,
    min: 0
  },
  fiber: {
    type: Number,
    default: 0,
    min: 0
  },
  sugar: {
    type: Number,
    default: 0,
    min: 0
  },
  sodium: {
    type: Number,
    default: 0,
    min: 0
  },
  servingSize: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for text search
foodSchema.index({ name: 'text', category: 'text' });

module.exports = mongoose.model('Food', foodSchema);