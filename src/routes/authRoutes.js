const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

const router = express.Router();

router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please provide a valid email').isEmail(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    ],
    registerUser
);

router.post(
    '/login',
    [
        check('email', 'Please provide a valid email').isEmail(),
        check('password', 'Password is required').not().isEmpty(),
    ],
    loginUser
);

router.get('/profile', protect, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Access granted to profile',
        user: req.user,
    });
});

router.get('/customer-area', protect, authorize('customer'), (req, res) => {
    res.status(200).json({ success: true, message: 'Welcome, customer!' });
});

router.get('/admin-dashboard', protect, authorize('admin'), (req, res) => {
    res.status(200).json({ success: true, message: 'Welcome, admin!' });
});

router.get('/support-tools', protect, authorize('support'), (req, res) => {
    res.status(200).json({ success: true, message: 'Welcome, support staff!' });
});

module.exports = router;