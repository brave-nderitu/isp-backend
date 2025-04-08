const { validationResult } = require('express-validator');

const validationHandler = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map((error) => ({
            field: error.param,
            message: error.msg,
            value: error.value || null,
        }));

        return res.status(400).json({
            success: false,
            errors: formattedErrors,
        });
    }

    next();
};

module.exports = validationHandler;