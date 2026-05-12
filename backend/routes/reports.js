const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

/**
 * @route   POST /api/reports
 * @desc    Submit a report
 * @access  Private
 */
router.post('/', auth, async (req, res) => {
    try {
        const { product, reason, description } = req.body;

        if (!product || !reason) {
            return res.status(400).json({ message: 'Product and reason are required' });
        }

        const report = new Report({
            reporter: req.user.id,
            product,
            reason,
            description
        });

        await report.save();

        res.status(201).json({ message: 'Report submitted successfully', report });
    } catch (err) {
        console.error('Report Submission Error:', err.message);
        res.status(500).json({ message: 'Server error during report submission' });
    }
});

/**
 * @route   GET /api/reports
 * @desc    Get all reports (Admin only)
 * @access  Private/Admin
 */
router.get('/', [auth, admin], async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('reporter', 'username email')
            .populate({
                path: 'product',
                select: 'title thumbnail seller',
                populate: { path: 'seller', select: 'username' }
            })
            .sort({ createdAt: -1 });

        res.json(reports);
    } catch (err) {
        console.error('Fetch Reports Error:', err.message);
        res.status(500).json({ message: 'Server error while fetching reports' });
    }
});

module.exports = router;
