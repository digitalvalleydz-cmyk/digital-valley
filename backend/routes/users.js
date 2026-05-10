const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

/**
 * @route   GET /api/users/dashboard
 * @desc    Get dashboard stats for current user
 * @access  Private
 */
router.get('/dashboard', auth, async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Stats for sellers
        if (req.user.accountType === 'seller') {
            const productsCount = await Product.countDocuments({ seller: userId });
            const activeOrders = await Order.find({ seller: userId, orderStatus: { $in: ['pending', 'in-progress'] } })
                .populate('product', 'title')
                .populate('buyer', 'username')
                .limit(5);
            
            const recentSales = await Order.find({ seller: userId, orderStatus: 'completed' })
                .sort({ updatedAt: -1 })
                .limit(5);

            return res.json({
                totalEarnings: req.user.totalEarnings,
                totalSales: req.user.totalSales,
                productsCount,
                activeOrders,
                recentSales,
                rating: req.user.rating
            });
        } 
        
        // Stats for buyers
        const activePurchases = await Order.find({ buyer: userId, orderStatus: { $in: ['pending', 'in-progress'] } })
            .populate('product', 'title thumbnail')
            .limit(5);
        
        const completedPurchases = await Order.countDocuments({ buyer: userId, orderStatus: 'completed' });

        res.json({
            activePurchases,
            completedPurchases,
            totalSpent: 0 // Logic to calculate if needed
        });

    } catch (err) {
        console.error('Dashboard Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   GET /api/users/:id
 * @desc    Get public seller profile
 * @access  Public
 */
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -email');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const products = await Product.find({ seller: req.params.id, isActive: true });

        res.json({ user, products });
    } catch (err) {
        console.error('Get User Profile Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update own profile
 * @access  Private
 */
router.put('/profile', auth, async (req, res) => {
    try {
        const { firstName, lastName, bio, avatar } = req.body;
        const updates = {};
        if (firstName) updates.firstName = firstName;
        if (lastName) updates.lastName = lastName;
        if (bio) updates.bio = bio;
        if (avatar) updates.avatar = avatar;

        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
        res.json(user);
    } catch (err) {
        console.error('Update Profile Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   PUT /api/users/whatsapp
 * @desc    Update WhatsApp number
 * @access  Private (Sellers)
 */
router.put('/whatsapp', auth, async (req, res) => {
    try {
        if (req.user.accountType !== 'seller') {
            return res.status(403).json({ message: 'Only sellers can set a business WhatsApp number' });
        }

        const { whatsapp } = req.body;
        if (!whatsapp) return res.status(400).json({ message: 'WhatsApp number is required' });

        const user = await User.findByIdAndUpdate(req.user._id, { whatsapp }, { new: true }).select('-password');
        res.json(user);
    } catch (err) {
        console.error('Update WhatsApp Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   GET /api/users/:id/products
 * @desc    Get seller products
 * @access  Public
 */
router.get('/:id/products', async (req, res) => {
    try {
        const products = await Product.find({ seller: req.params.id, isActive: true });
        res.json(products);
    } catch (err) {
        console.error('Get User Products Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
