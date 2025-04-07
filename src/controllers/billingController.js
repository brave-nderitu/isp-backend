const Billing = require('../models/billingModel');
const User = require('../models/userModel');
const Plan = require('../models/planModel');

const generateInvoice = async (req, res) => {
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
        console.error('Error generating invoice:', error);
        res.status(500).json({ message: 'Server error while generating invoice' });
    }
};

const getMyInvoices = async (req, res) => {
    try {
        const invoices = await Billing.find({ userId: req.user.id }).populate('planId');
        res.status(200).json({ invoices });
    } catch (error) {
        console.error('Error fetching user invoices:', error);
        res.status(500).json({ message: 'Server error while fetching invoices' });
    }
};

const getAllInvoices = async (req, res) => {
    try {
        const invoices = await Billing.find()
            .populate('userId', 'name email role')
            .populate('planId', 'name cost');
        res.status(200).json({ invoices });
    } catch (error) {
        console.error('Error fetching all invoices:', error);
        res.status(500).json({ message: 'Server error while fetching all invoices' });
    }
};

const updateInvoiceStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ['paid', 'pending', 'overdue'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        let invoice;

        if (req.user.role === 'admin') {
            invoice = await Billing.findByIdAndUpdate(req.params.id, { status }, { new: true });
        } else {
            invoice = await Billing.findOneAndUpdate(
                { _id: req.params.id, userId: req.user.id },
                { status },
                { new: true }
            );
        }

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found or unauthorized' });
        }

        res.status(200).json({ message: 'Invoice status updated successfully', invoice });
    } catch (error) {
        console.error('Error updating invoice status:', error);
        res.status(500).json({ message: 'Server error while updating invoice' });
    }
};

module.exports = {
    generateInvoice,
    getMyInvoices,
    getAllInvoices,
    updateInvoiceStatus,
    payInvoice: updateInvoiceStatus,
};