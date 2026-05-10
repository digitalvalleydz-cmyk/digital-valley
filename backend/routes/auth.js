const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Helper to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, firstName, lastName, accountType, whatsapp } = req.body;

        // Basic validation (Mongoose handles most of it, but checking existence here)
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide username, email and password' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ 
                message: existingUser.email === email ? 'Email already registered' : 'Username already taken' 
            });
        }

        // Create new user
        const user = new User({
            username,
            email,
            password,
            firstName,
            lastName,
            accountType,
            whatsapp
        });

        await user.save();

        // Return user (without password) and token
        const token = generateToken(user._id);
        
        // Convert to object and remove password
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: userResponse
        });

    } catch (err) {
        console.error('Registration Error:', err.message);
        res.status(500).json({ message: 'Server error during registration', error: err.message });
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email and explicitly select password
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Update last login (optional, not in schema yet)
        // Generate token
        const token = generateToken(user._id);

        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({
            message: 'Login successful',
            token,
            user: userResponse
        });

    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ message: 'Server error during login' });
    }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', auth, async (req, res) => {
    try {
        res.json(req.user);
    } catch (err) {
        console.error('Get Me Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout (Client side clearing)
 * @access  Public
 */
router.post('/logout', (req, res) => {
    // In JWT, logout is usually handled client-side by deleting the token.
    // Here we just acknowledge it.
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
