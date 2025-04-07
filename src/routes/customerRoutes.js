const express = require('express');
const {
    getMyInvoices,
    payInvoice,
} = require('../controllers/billingController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, authorize('customer'));

router.get('/my-invoices', getMyInvoices);

router.patch('/pay-invoice/:id', payInvoice);

module.exports = router;