const express = require('express');
const { registerUser, loginUser } = require('../controllers/auth-controller');
const validationHandler = require('../middleware/validation-handler');
const { check } = require('express-validator');

const router = express.Router();

router.post(
    '/register',
    [
        check('name').notEmpty().withMessage('Name is required'),
        check('email').isEmail().withMessage('Please provide a valid email'),
        check('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
    ],
    validationHandler,
    registerUser
);

router.post(
    '/login',
    [
        check('email').isEmail().withMessage('Please provide a valid email'),
        check('password').notEmpty().withMessage('Password is required'),
    ],
    validationHandler,
    loginUser
);

module.exports = router;