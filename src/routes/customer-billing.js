const express = require('express');
const {
    getMyInvoices,
    payInvoice,
} = require('../controllers/billing-controller');
const { protect, authorize } = require('../middleware/auth-middleware');

const router = express.Router();

router.get('/my-invoices', protect, authorize('customer'), getMyInvoices);

router.post('/pay-invoice/:id', protect, authorize('customer'), payInvoice);

module.exports = router;