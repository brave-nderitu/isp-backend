const jwt = require('jsonwebtoken');
const { handleServerError } = require('../utils/error-helpers');

const protect = async (req, res, next) => {
    let token;

    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decoded.id,
            role: decoded.role,
        };

        next();
    } catch (error) {
        console.error('JWT verification error:', error);
        return res.status(401).json({
            message: error.name === 'TokenExpiredError' ? 'Token expired, please login again' : 'Not authorized, invalid token',
        });
    }
};

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Access denied, insufficient permissions',
            });
        }
        next();
    };
};

module.exports = { protect, authorize };