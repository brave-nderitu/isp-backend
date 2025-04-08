const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        planId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Plan',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: [0, 'Amount cannot be negative'], // Validation for non-negative amounts
        },
        status: {
            type: String,
            enum: ['paid', 'pending', 'overdue'], // Enum ensures controlled values
            default: 'pending',
        },
        issuedAt: {
            type: Date,
            default: Date.now, // Automatically sets issue date to the current timestamp
        },
        dueAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields automatically
    }
);

// Indexing for efficient queries
billingSchema.index({ userId: 1, status: 1 }); // Optimizes queries by user and status
billingSchema.index({ dueAt: 1 }); // Improves overdue invoice lookups

// Schema Methods (if needed for reusability in logic)
billingSchema.methods.isOverdue = function () {
    return this.status === 'pending' && this.dueAt < Date.now();
};

// Export the Billing model
module.exports = mongoose.model('Billing', billingSchema);