const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { check } = require('express-validator');

const router = express.Router();

// Registration Route
router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please provide a valid email').isEmail(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    ],
    registerUser
);

// Login Route
router.post(
    '/login',
    [
        check('email', 'Please provide a valid email').isEmail(),
        check('password', 'Password is required').not().isEmpty(),
    ],
    loginUser
);

module.exports = router;