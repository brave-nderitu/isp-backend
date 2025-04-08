const User = require('../models/user-model');
const { generateToken } = require('../utils/auth-helpers');
const { handleServerError } = require('../utils/error-helpers');
const { validationResult } = require('express-validator');

exports.registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin email already exists' });
        }

        const newAdmin = await User.create({ name, email, password, role: 'admin' });

        return res.status(201).json({
            message: 'Admin registered successfully',
            admin: {
                id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email,
                role: newAdmin.role,
            },
        });

    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'customer',
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        handleServerError(res, 'Error registering user', error);
    }
};

exports.loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        handleServerError(res, 'Error during login', error);
    }
};