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

const getUpdatedClientsCount = async () => {
    return await callRepository.getUpdatedClientsCount();
};

const getUpdatedClientsGroupedByDate = async () => {
    return await callRepository.getUpdatedClientsByDate();
  };
module.exports = {
    getCallCounts,
    getUpdatedClientsCount,
    getUpdatedClientsGroupedByDate
};