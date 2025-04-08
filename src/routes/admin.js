const express = require('express');
const { protect, authorize } = require('../middleware/auth-middleware');
const planRoutes = require('./admin-plans');
const billingRoutes = require('./admin-billing');

const router = express.Router();

router.use(protect, authorize('admin'));

router.use('/plans', planRoutes);

router.use('/billing', billingRoutes);

module.exports = router;