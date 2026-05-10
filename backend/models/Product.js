const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Product title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Design', 'Development', 'Writing', 'Marketing', 'Music', 'Video', 'Photography', 'Animation']
    },
    type: {
        type: String,
        required: [true, 'Product type is required'],
        enum: ['service', 'digital-product']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    thumbnail: {
        type: String,
        default: 'default-thumbnail.jpg'
    },
    files: [{
        type: String // URLs or paths to digital files
    }],
    deliveryTime: {
        type: String,
        enum: ['1-3 days', '3-5 days', '1 week', '2 weeks', 'instant'],
        default: '3-5 days'
    },
    tags: [{
        type: String,
        trim: true
    }],
    rating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    totalSales: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    whatsapp: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for search functionality
productSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
