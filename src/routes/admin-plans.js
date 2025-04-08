const express = require('express');
const { createPlan, assignPlan } = require('../controllers/plan-controller');
const { check } = require('express-validator');
const validationHandler = require('../middleware/validation-handler');

const router = express.Router();

router.post(
    '/create',
    [
        check('name', 'Plan name is required').notEmpty(),
        check('cost', 'Cost must be a numeric value').isNumeric(),
        check('speed', 'Speed is required').notEmpty(),
        check('features', 'Features must be an array').isArray(),
    ],
    validationHandler,
    createPlan
);

router.patch(
    '/assign',
    [
        check('userId', 'User ID is required').notEmpty(),
        check('planId', 'Plan ID is required').notEmpty(),
    ],
    validationHandler,
    assignPlan
);

module.exports = router;