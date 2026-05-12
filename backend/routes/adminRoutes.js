const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Report = require('../models/Report');
const sendEmail = require('../utils/email');

/**
 * @route   GET /api/admin/stats
 * @desc    Get admin dashboard stats
 * @access  Private/Admin
 */
router.get('/stats', [auth, admin], async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const pendingReports = await Report.countDocuments({ status: 'pending' });

        res.json({
            totalUsers,
            totalProducts,
            totalOrders,
            pendingReports
        });
    } catch (err) {
        console.error('Admin Stats Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   GET /api/admin/users
 * @desc    Get all users
 * @access  Private/Admin
 */
router.get('/users', [auth, admin], async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error('Admin Fetch Users Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   PUT /api/admin/users/:id/status
 * @desc    Suspend or activate user account
 * @access  Private/Admin
 */
router.put('/users/:id/status', [auth, admin], async (req, res) => {
    try {
        const { isActive } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true }).select('-password');
        
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        res.json({ message: `User account ${isActive ? 'activated' : 'suspended'} successfully`, user });
    } catch (err) {
        console.error('Admin User Status Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user account
 * @access  Private/Admin
 */
router.delete('/users/:id', [auth, admin], async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User account deleted successfully' });
    } catch (err) {
        console.error('Admin User Delete Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   GET /api/admin/products/pending
 * @desc    Get all pending products
 * @access  Private/Admin
 */
router.get('/products/pending', [auth, admin], async (req, res) => {
    try {
        const products = await Product.find({ status: 'pending' }).populate('seller', 'username email');
        res.json(products);
    } catch (err) {
        console.error('Admin Fetch Pending Products Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   GET /api/admin/products
 * @desc    Get all products (active, pending, rejected)
 * @access  Private/Admin
 */
router.get('/products', [auth, admin], async (req, res) => {
    try {
        const products = await Product.find().populate('seller', 'username email').sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error('Admin Fetch Products Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   PUT /api/admin/products/:id/approve
 * @desc    Approve product
 * @access  Private/Admin
 */
router.put('/products/:id/approve', [auth, admin], async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true }).populate('seller', 'email username');
        
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Send email notification
        try {
            await sendEmail({
                email: product.seller.email,
                subject: 'Product Approved - DigitalValley',
                message: `Congratulations ${product.seller.username}! Your product "${product.title}" has been approved and is now live on DigitalValley.`,
                html: `<h1>Product Approved</h1><p>Congratulations ${product.seller.username}!</p><p>Your product <strong>"${product.title}"</strong> has been approved and is now live on DigitalValley.</p>`
            });
        } catch (emailErr) {
            console.error('Email Notification Error:', emailErr.message);
        }

        res.json({ message: 'Product approved successfully', product });
    } catch (err) {
        console.error('Admin Approve Product Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   PUT /api/admin/products/:id/reject
 * @desc    Reject product with reason
 * @access  Private/Admin
 */
router.put('/products/:id/reject', [auth, admin], async (req, res) => {
    try {
        const { reason } = req.body;
        const product = await Product.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true }).populate('seller', 'email username');
        
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Send email notification
        try {
            await sendEmail({
                email: product.seller.email,
                subject: 'Product Rejected - DigitalValley',
                message: `Hello ${product.seller.username}. We regret to inform you that your product "${product.title}" has been rejected. Reason: ${reason}`,
                html: `<h1>Product Rejected</h1><p>Hello ${product.seller.username},</p><p>We regret to inform you that your product <strong>"${product.title}"</strong> has been rejected.</p><p><strong>Reason:</strong> ${reason}</p>`
            });
        } catch (emailErr) {
            console.error('Email Notification Error:', emailErr.message);
        }

        res.json({ message: 'Product rejected successfully', product });
    } catch (err) {
        console.error('Admin Reject Product Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   DELETE /api/admin/products/:id
 * @desc    Delete product
 * @access  Private/Admin
 */
router.delete('/products/:id', [auth, admin], async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error('Admin Product Delete Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
