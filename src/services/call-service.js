const callRepository = require('../repository/call-repository');

const getCallCounts = async (period) => {
    if (period === 'daily' || period === 'monthly') {
        return await callRepository.getCallCountsByType(period);
    } else if (period === 'total') {
        return await callRepository.getTotalCallCounts();
    } else {
        throw new Error('Invalid period. Valid values are "daily", "monthly", "total".');
    }
};

module.exports = {
    getCallCounts,
};