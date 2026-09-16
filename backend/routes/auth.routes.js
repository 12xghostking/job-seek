const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');
const { signToken, requireAuth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// POST /api/signup
router.post('/signup', authLimiter, async (req, res, next) => {
  try {
    const { role, name, email, password } = req.body;

    if (!role || !name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required (role, name, email, password)' });
    }

    if (!['user', 'employer'].includes(role)) {
      return res.status(400).json({ error: 'Role must be either user or employer' });
    }

    if (password.length < 5) {
      return res.status(400).json({ error: 'Password must be at least 5 characters long' });
    }

    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newUser = new UserModel({
      role,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    await newUser.save();

    const token = signToken({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      userId: newUser._id,
      name: newUser.name,
      role: newUser.role,
      email: newUser.email,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/login
router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { role, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (role && user.role !== role) {
      return res.status(401).json({ error: `Account exists as ${user.role}, not ${role}` });
    }

    const token = signToken({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/me
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
