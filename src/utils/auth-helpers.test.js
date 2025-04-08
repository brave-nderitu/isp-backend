require('dotenv').config();
const { generateToken } = require('./auth-helpers');

describe('generateToken', () => {
    it('should create a valid JWT token', () => {
        const user = { _id: '123', role: 'admin' };
        const token = generateToken(user);

        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
    });
});