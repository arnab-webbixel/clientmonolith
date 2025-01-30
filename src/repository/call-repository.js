const Client = require('../models/client');


const getCallCountsByType = async (period) => {
    let matchCriteria = {};

    // Define the match criteria based on the period
    if (period === 'daily') {
        // Match clients created today
        matchCriteria['createdAt'] = {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of today
        };
    } else if (period === 'monthly') {
        // Match clients created in the current month
        matchCriteria['createdAt'] = {
            $gte: new Date(new Date().setDate(1)), // Start of this month
        };
    }

    // Aggregate query to count calls by type
    return Client.aggregate([
        { $match: matchCriteria },  // Match based on the period
        { 
            $group: {
                _id: '$call_type',        // Group by call_type
                count: { $sum: 1 },       // Count the number of clients
            }
        }
    ]);
};

// Count total calls by call type
const getTotalCallCounts = async () => {
    return Client.aggregate([
        { $group: { _id: '$call_type', count: { $sum: 1 } } }
    ]);
};

module.exports = {
    getCallCountsByType,
    getTotalCallCounts,
};