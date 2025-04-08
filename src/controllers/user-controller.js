const User = require('../models/user-model');
const { handleServerError } = require('../utils/error-helpers');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'Profile retrieved successfully',
            user,
        });
    } catch (error) {
        handleServerError(res, 'Error retrieving profile', error);
    }
};

exports.customerArea = async (req, res) => {
    try {
        res.status(200).json({
            message: 'Welcome to your customer area!',
            details: 'Here you can manage billing, subscriptions, and account settings.',
        });
    } catch (error) {
        handleServerError(res, 'Error accessing customer area', error);
    }
};

exports.adminDashboard = async (req, res) => {
    try {
        res.status(200).json({
            message: 'Admin dashboard access granted.',
            tools: ['Manage Users', 'View Reports', 'Handle Billing', 'Provide Support'],
        });
    } catch (error) {
        handleServerError(res, 'Error accessing admin dashboard', error);
    }
};