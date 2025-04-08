const { protect } = require('./auth-middleware');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('protect middleware', () => {
    it('should authorize a user with a valid token', async () => {
        const req = { headers: { authorization: 'Bearer validToken' } };
        const res = {};
        const next = jest.fn();

        jwt.verify.mockReturnValue({ id: '123', role: 'admin' });

        await protect(req, res, next);
        expect(req.user).toEqual({ id: '123', role: 'admin' });
        expect(next).toHaveBeenCalled();
    });
});