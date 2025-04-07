const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
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
        min: [0, 'Amount cannot be negative'],
    },
    status: {
        type: String,
        enum: ['paid', 'pending', 'overdue'],
        default: 'pending',
    },
    issuedAt: {
        type: Date,
        default: Date.now,
    },
    dueAt: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
});

billingSchema.index({ userId: 1, status: 1 });
billingSchema.index({ dueAt: 1 });

module.exports = mongoose.model('Billing', billingSchema);