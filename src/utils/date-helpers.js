exports.addDays = (date, days) => {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
};

exports.formatDate = (date) => {
    return date.toISOString().split('T')[0];
};