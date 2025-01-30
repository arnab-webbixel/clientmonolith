
const callService = require('../services/call-service');

const getCallCounts = async (req, res) => {
    const { period } = req.query; // period could be "daily", "monthly", or "total"
    console.log('Received period:', period);

    if (!['daily', 'monthly', 'total'].includes(period)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid period. Valid values are "daily", "monthly", or "total".'
        });
    }
    try {
        const data = await callService.getCallCounts(period);
        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getCallCounts,
};
