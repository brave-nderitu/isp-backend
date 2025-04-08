const Plan = require('../models/plan-model');
const User = require('../models/user-model');
const { handleServerError } = require('../utils/error-helpers');

exports.createPlan = async (req, res) => {
    try {
        const { name, cost, speed, features } = req.body;

        if (!name || !cost) {
            return res.status(400).json({ message: 'Name and cost are required' });
        }

        const plan = await Plan.create({ name, cost, speed, features });

        res.status(201).json({
            message: 'Plan created successfully',
            plan,
        });
    } catch (error) {
        handleServerError(res, 'Error creating plan', error);
    }
};

exports.assignPlan = async (req, res) => {
    try {
        const { userId, planId } = req.body;

        if (!userId || !planId) {
            return res.status(400).json({ message: 'userId and planId are required' });
        }

        const plan = await Plan.findById(planId);
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized to assign plans' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { currentPlanId: planId },
            { new: true }
        );

        res.status(200).json({
            message: 'Plan assigned successfully',
            user: updatedUser,
        });
    } catch (error) {
        handleServerError(res, 'Error assigning plan', error);
    }
};

exports.getAllPlans = async (req, res) => {
    try {
        const plans = await Plan.find();
        res.status(200).json({ plans });
    } catch (error) {
        handleServerError(res, 'Error fetching plans', error);
    }
};

exports.getPlanDetails = async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }

        res.status(200).json({ plan });
    } catch (error) {
        handleServerError(res, 'Error retrieving plan details', error);
    }
};