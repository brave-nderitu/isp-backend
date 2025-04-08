const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./user');
const customerBillingRoutes = require('./customer-billing');
const adminRoutes = require('./admin');

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/users', userRoutes);

router.use('/customers/billing', customerBillingRoutes);

router.use('/admin', adminRoutes);

module.exports = router;