const express = require('express');
const { check, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    generateInvoice,
    getAllInvoices,
    updateInvoiceStatus,
} = require('../controllers/billingController');
const User = require('../models/userModel');
const Plan = require('../models/planModel');

const router = express.Router();

router.use(protect, authorize('admin'));

router.post('/create-plan', async (req, res) => {
    try {
        const { name, cost, speed, features } = req.body;

        if (!name || !cost) {
            return res.status(400).json({ message: 'Name and cost are required' });
        }

        const plan = await Plan.create({ name, cost, speed, features });
        res.status(201).json({ message: 'Plan created successfully', plan });
    } catch (error) {
        console.error('Error creating plan:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.patch('/assign-plan', async (req, res) => {
    try {
        const { userId, planId } = req.body;

        if (!userId || !planId) {
            return res.status(400).json({ message: 'userId and planId are required' });
        }

        const plan = await Plan.findById(planId);
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { currentPlanId: planId },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Plan assigned successfully', user });
    } catch (error) {
        console.error('Error assigning plan:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

const validateInvoiceCreation = [
    check('userId')
        .notEmpty()
        .withMessage('userId is required')
        .isMongoId()
        .withMessage('userId must be a valid MongoDB ObjectId'),
    check('amount')
        .isNumeric()
        .withMessage('Amount must be numeric')
        .custom(value => value > 0)
        .withMessage('Amount must be greater than zero'),
    check('dueAt')
        .notEmpty()
        .withMessage('dueAt is required')
        .isISO8601()
        .withMessage('dueAt must be a valid date'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = errors.array().map(err => ({
                field: err.param,
                message: err.msg,
            }));
            return res.status(400).json({ errors: formattedErrors });
        }
        next();
    },
];

// router.post('/create-invoice', validateInvoiceCreation, createInvoice);

router.post('/generate-invoice', generateInvoice);

router.get('/all-invoices', getAllInvoices);

router.patch('/update-invoice/:id', updateInvoiceStatus);

module.exports = router;