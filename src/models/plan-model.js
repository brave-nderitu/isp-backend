const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Plan name is required'], // Added descriptive error message
            trim: true,
        },
        cost: {
            type: Number,
            required: [true, 'Plan cost is required'], // Added descriptive error message
            min: [0, 'Cost cannot be negative'], // Validation for non-negative cost
        },
        speed: {
            type: String,
            trim: true, // Removes unnecessary whitespace
        },
        features: {
            type: [String],
            validate: {
                validator: function (arr) {
                    return arr.length > 0;
                },
                message: 'Plan must have at least one feature', // Validates non-empty array
            },
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

module.exports = mongoose.model('Plan', planSchema);