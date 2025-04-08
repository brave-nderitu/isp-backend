const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: [/.+@.+\..+/, 'Please enter a valid email address'], // Enhanced validation
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        role: {
            type: String,
            enum: ['customer', 'admin', 'support_staff'],
            default: 'customer',
        },
        currentPlanId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Plan',
        },
    },
    {
        timestamps: true, // Automatically manages createdAt and updatedAt
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Only hash if the password has been modified
    try {
        const salt = await bcrypt.genSalt(10); // Salt for hashing
        this.password = await bcrypt.hash(this.password, salt); // Hash password
        next();
    } catch (err) {
        next(err);
    }
});

// Compare hashed password with entered password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Remove sensitive information when converting to JSON
userSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.password; // Remove password field
        return ret; // Return sanitized user object
    },
});

// Enhance query and model flexibility
userSchema.virtual('isAdmin').get(function () {
    return this.role === 'admin';
});

module.exports = mongoose.model('User', userSchema);