const Billing = require('../models/billing-model');
const User = require('../models/user-model');
const Plan = require('../models/plan-model');
const { handleServerError } = require('../utils/error-helpers');

exports.generateInvoice = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'userId is required' });
        }

        const user = await User.findById(userId);
        if (!user || !user.currentPlanId) {
            return res.status(404).json({ message: 'User not found or no plan assigned' });
        }

        const plan = await Plan.findById(user.currentPlanId);
        if (!plan) {
            return res.status(404).json({ message: 'Assigned plan not found' });
        }

        const invoice = await Billing.create({
            userId,
            planId: plan._id,
            amount: plan.cost,
            status: 'pending',
            issuedAt: new Date(),
            dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        res.status(201).json({ message: 'Invoice generated successfully', invoice });
    } catch (error) {
        handleServerError(res, 'Error generating invoice', error);
    }
};

exports.getMyInvoices = async (req, res) => {
    try {
        const invoices = await Billing.find({ userId: req.user.id })
            .populate('planId', 'name cost');

        res.status(200).json({ invoices });
    } catch (error) {
        handleServerError(res, 'Error fetching user invoices', error);
    }
};

exports.getAllInvoices = async (req, res) => {
    try {
        const invoices = await Billing.find()
            .populate('userId', 'name email role')
            .populate('planId', 'name cost');

        res.status(200).json({ invoices });
    } catch (error) {
        handleServerError(res, 'Error fetching all invoices', error);
    }
};

exports.updateInvoiceStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ['paid', 'pending', 'overdue'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const filter = req.user.role === 'admin' 
            ? { _id: req.params.id } 
            : { _id: req.params.id, userId: req.user.id };

        const invoice = await Billing.findOneAndUpdate(filter, { status }, { new: true });

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found or unauthorized' });
        }

        res.status(200).json({ message: 'Invoice status updated successfully', invoice });
    } catch (error) {
        handleServerError(res, 'Error updating invoice status', error);
    }
};

exports.payInvoice = async (req, res) => {
    try {
        const invoice = await Billing.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { status: 'paid' },
            { new: true }
        );

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found or unauthorized' });
        }

        res.status(200).json({ message: 'Invoice paid successfully', invoice });
    } catch (error) {
        handleServerError(res, 'Error processing payment', error);
    }
};