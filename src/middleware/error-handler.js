const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || res.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Server Error',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });

    if (process.env.NODE_ENV !== 'production') {
        console.error(`[${req.method}] ${req.originalUrl} - ${err.message}`);
        console.error(err.stack);
    }
};

module.exports = { notFound, errorHandler };