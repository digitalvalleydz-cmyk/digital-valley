const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// Multer configuration for thumbnail upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Images only (jpg, png, webp)'));
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter
});

/**
 * @route   GET /api/products
 * @desc    Get all products with filters
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const { category, type, minPrice, maxPrice, sort, search } = req.query;
        let query = { isActive: true };

        // Filtering
        if (category) query.category = category;
        if (type) query.type = type;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (search) {
            query.$text = { $search: search };
        }

        // Sorting
        let sortOption = { createdAt: -1 }; // default
        if (sort === 'price-asc') sortOption = { price: 1 };
        if (sort === 'price-desc') sortOption = { price: -1 };
        if (sort === 'rating') sortOption = { rating: -1 };

        const products = await Product.find(query)
            .populate('seller', 'username avatar rating')
            .sort(sortOption);

        res.json(products);
    } catch (err) {
        console.error('Get Products Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   GET /api/products/:id
 * @desc    Get single product with seller info and reviews
 * @access  Public
 */
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('seller', 'username avatar bio rating totalSales createdAt whatsapp');
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const reviews = await Review.find({ product: req.params.id })
            .populate('buyer', 'username avatar');

        res.json({ product, reviews });
    } catch (err) {
        console.error('Get Product Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   POST /api/products
 * @desc    Create new product
 * @access  Private (Sellers only)
 */
router.post('/', auth, upload.single('thumbnail'), async (req, res) => {
    try {
        // Check if user is a seller
        if (req.user.accountType !== 'seller') {
            return res.status(403).json({ message: 'Only sellers can create products' });
        }

        const { title, description, category, type, price, deliveryTime, tags, whatsapp } = req.body;

        const product = new Product({
            title,
            description,
            category,
            type,
            price,
            deliveryTime,
            tags: tags ? JSON.parse(tags) : [],
            whatsapp: whatsapp || req.user.whatsapp,
            seller: req.user._id,
            thumbnail: req.file ? req.file.path : 'default-thumbnail.jpg'
        });

        await product.save();
        res.status(201).json(product);
    } catch (err) {
        console.error('Create Product Error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Private (Owner only)
 */
router.put('/:id', auth, upload.single('thumbnail'), async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Check ownership
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updates = req.body;
        if (req.file) updates.thumbnail = req.file.path;
        if (updates.tags) updates.tags = JSON.parse(updates.tags);

        product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
        res.json(product);
    } catch (err) {
        console.error('Update Product Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Private (Owner only)
 */
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } catch (err) {
        console.error('Delete Product Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   POST /api/products/:id/reviews
 * @desc    Add review to product
 * @access  Private (Buyers only)
 */
router.post('/:id/reviews', auth, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Basic check: sellers shouldn't review their own product
        if (product.seller.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot review your own product' });
        }

        const review = new Review({
            product: req.params.id,
            buyer: req.user._id,
            rating,
            comment
        });

        await review.save();

        // Update product rating
        const reviews = await Review.find({ product: req.params.id });
        product.totalReviews = reviews.length;
        product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
        
        await product.save();

        res.status(201).json(review);
    } catch (err) {
        console.error('Add Review Error:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

/**
 * @route   GET /api/products/seller/:sellerId
 * @desc    Get all products by a specific seller
 * @access  Public
 */
router.get('/seller/:sellerId', async (req, res) => {
    try {
        const products = await Product.find({ seller: req.params.sellerId, isActive: true })
            .sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error('Get Seller Products Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
