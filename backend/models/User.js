const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    min: 1,
    max: 120
  },
  height: {
    type: Number,
    min: 50,
    max: 300
  },
  weight: {
    type: Number,
    min: 20,
    max: 500
  },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
    default: 'moderate'
  },
  goal: {
    type: String,
    enum: ['lose', 'maintain', 'gain'],
    default: 'maintain'
  },
  dailyCalorieGoal: {
    type: Number,
    default: 2000,
    min: 1000,
    max: 5000
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: String,
  otpExpires: Date
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.otp;
  delete user.otpExpires;
  return user;
};

module.exports = mongoose.model('User', userSchema);