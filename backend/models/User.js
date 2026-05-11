const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters']
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false // Never return password in queries by default
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    accountType: {
        type: String,
        enum: ['buyer', 'seller'],
        default: 'buyer'
    },
    avatar: {
        type: String,
        default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder'
    },
    whatsapp: {
        type: String,
        required: function() { return this.accountType === 'seller'; }
    },
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    rating: {
        type: Number,
        default: 0
    },
    totalSales: {
        type: Number,
        default: 0
    },
    totalEarnings: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        throw err;
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
