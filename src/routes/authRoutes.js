const express = require('express');
const { registerUser } = require('../controllers/authController');
const router = express.Router();
const { check } = require('express-validator');

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

module.exports = router;