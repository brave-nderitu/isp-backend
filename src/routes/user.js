const express = require('express');
const { protect, authorize } = require('../middleware/auth-middleware');
const {
    getProfile,
    customerArea,
    adminDashboard,
} = require('../controllers/user-controller');

const router = express.Router();

router.get('/profile', protect, getProfile);

router.get('/customer-area', protect, customerArea);

router.get('/admin-dashboard', protect, authorize('admin'), adminDashboard);

module.exports = router;