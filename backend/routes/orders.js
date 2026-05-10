const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/auth');
const multer = require('multer');

// Multer for proof of payment
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `proof-${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

/**
 * @route   POST /api/orders
 * @desc    Create new order
 * @access  Private (Buyer only)
 */
router.post('/', auth, async (req, res) => {
    try {
        const { productId, paymentMethod, notes, currency } = req.body;
        const product = await Product.findById(productId);
        
        if (!product) return res.status(404).json({ message: 'Product not found' });
        if (product.seller.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot buy your own product' });
        }

        const order = new Order({
            buyer: req.user._id,
            seller: product.seller,
            product: productId,
            amount: product.price,
            currency: currency || 'USD',
            paymentMethod,
            notes
        });

        await order.save();
        res.status(201).json(order);
    } catch (err) {
        console.error('Create Order Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   GET /api/orders
 * @desc    Get all orders for current user
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
    try {
        // Buyer sees orders they made, Seller sees orders they received
        const query = { $or: [{ buyer: req.user._id }, { seller: req.user._id }] };
        const orders = await Order.find(query)
            .populate('product', 'title thumbnail price')
            .populate('buyer', 'username avatar email')
            .populate('seller', 'username avatar email whatsapp')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        console.error('Get Orders Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   GET /api/orders/:id
 * @desc    Get single order details
 * @access  Private
 */
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('product', 'title description thumbnail price category type')
            .populate('buyer', 'username avatar email')
            .populate('seller', 'username avatar email whatsapp');

        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Access check
        if (order.buyer._id.toString() !== req.user._id.toString() && 
            order.seller._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(order);
    } catch (err) {
        console.error('Get Order Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   PUT /api/orders/:id/confirm
 * @desc    Seller confirms payment
 * @access  Private (Seller only)
 */
router.put('/:id/confirm', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.seller.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        order.paymentStatus = 'confirmed';
        order.whatsappConfirmed = true;
        order.orderStatus = 'in-progress';
        
        await order.save();
        res.json(order);
    } catch (err) {
        console.error('Confirm Payment Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   PUT /api/orders/:id/complete
 * @desc    Seller marks order as completed
 * @access  Private (Seller only)
 */
router.put('/:id/complete', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.seller.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        order.orderStatus = 'completed';
        await order.save();

        // Update seller stats
        const seller = await User.findById(order.seller);
        seller.totalSales += 1;
        seller.totalEarnings += order.amount;
        await seller.save();

        // Update product stats
        const product = await Product.findById(order.product);
        product.totalSales += 1;
        await product.save();

        res.json(order);
    } catch (err) {
        console.error('Complete Order Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   PUT /api/orders/:id/cancel
 * @desc    Cancel order
 * @access  Private (Buyer or Seller)
 */
router.put('/:id/cancel', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.buyer.toString() !== req.user._id.toString() && 
            order.seller.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        order.orderStatus = 'cancelled';
        await order.save();
        res.json(order);
    } catch (err) {
        console.error('Cancel Order Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   POST /api/orders/:id/proof
 * @desc    Buyer uploads proof of payment
 * @access  Private (Buyer only)
 */
router.post('/:id/proof', auth, upload.single('proof'), async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.buyer.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (!req.file) return res.status(400).json({ message: 'Please upload a file' });

        order.proofOfPayment = req.file.path;
        await order.save();
        res.json(order);
    } catch (err) {
        console.error('Upload Proof Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
