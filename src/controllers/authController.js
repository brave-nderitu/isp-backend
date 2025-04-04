const User = require('../models/userModel');
const { validationResult } = require('express-validator');

// @desc   Register a new user
// @route  POST /api/auth/register
// @access Public
exports.registerUser = async (req, res) => {
    // Validate user input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    try {
        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const user = new User({
            name,
            email,
            password, // The password will be hashed in the model's pre-save hook
            role,
        });

        // Save user to database
        const savedUser = await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role,
                createdAt: savedUser.createdAt,
            },
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};