exports.handleServerError = (res, message, error) => {
    console.error(message, error);
    res.status(500).json({ message: 'Server error' });
};