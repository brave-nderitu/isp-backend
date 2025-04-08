const { registerAdmin } = require('./auth-controller');
const User = require('../models/user-model');

jest.mock('../models/user-model');

describe('registerAdmin controller', () => {
    beforeEach(() => {
        process.env.JWT_SECRET = 'test_secret'; // Mock JWT secret
    });

    it('should register a new admin successfully', async () => {
        const req = { body: { name: 'Admin', email: 'admin@example.com', password: 'password123' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue({ _id: '123', name: 'Admin', email: 'admin@example.com', role: 'admin' });

        await registerAdmin(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Admin registered successfully',
            admin: { id: '123', name: 'Admin', email: 'admin@example.com', role: 'admin' },
        });
    });

    it('should return an error when missing required fields', async () => {
        const req = { body: { email: 'admin@example.com' } }; // Missing name & password
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await registerAdmin(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required' });
    });

    it('should return an error if admin email already exists', async () => {
        const req = { body: { email: 'admin@example.com', name: 'Admin', password: 'password123' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        User.findOne.mockResolvedValue({ email: 'admin@example.com' });

        await registerAdmin(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Admin email already exists' });
    });
});