const express = require('express');
const {
    generateInvoice,
    getAllInvoices,
    updateInvoiceStatus
} = require('../controllers/billing-controller');
const { check } = require('express-validator');
const validationHandler = require('../middleware/validation-handler');

const router = express.Router();

router.post(
    '/generate',
    [
        check('userId', 'User ID is required').notEmpty(),
        check('planId', 'Plan ID is required').notEmpty(),
        check('amount', 'Amount must be a number').isNumeric(),
    ],
    validationHandler,
    generateInvoice
);

router.get('/all', getAllInvoices);

router.patch(
    '/update/:id',
    [
        check('status', 'Status must be either paid or pending').isIn(['paid', 'pending']),
    ],
    validationHandler,
    updateInvoiceStatus
);

module.exports = router;