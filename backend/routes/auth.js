const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendOTP } = require('../utils/email');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Signup
router.post('/signup', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Invalid input data', errors: errors.array() });
    }

    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    const user = new User({
      email,
      password,
      name,
      otp,
      otpExpires
    });

    await user.save();

    // Send OTP email
    try {
      await sendOTP(email, otp, name);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue without failing the signup
    }

    res.status(201).json({ 
      message: 'User created successfully. Please check your email for OTP verification.',
      email: user.email
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// Verify OTP
router.post('/verify-otp', [
  body('email').isEmail().normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const { email, otp } = req.body;

    const user = await User.findOne({ 
      email,
      otp,
      otpExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Verify user and clear OTP
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      message: 'Email verified successfully',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email first' });
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const allowedUpdates = ['name', 'age', 'height', 'weight', 'activityLevel', 'goal', 'dailyCalorieGoal'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

module.exports = router;