
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

/**
 * GET /api/v1/updates/count
 * Returns the count of clients that have been updated (i.e. updatedAt > createdAt).
 * 
 **/
const getUpdatedClientsCount = async (req, res) => {
    try {
      const count = await callService.getUpdatedClientsCount();
      return res.status(200).json({ updatedClientsCount: count });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };



/**
 * GET /api/clients/updates/grouped
 * Returns updated clients grouped by the day they were updated.
 */
const getUpdatedClientsGroupedByDate = async (req, res) => {
    try {
      const groupedData = await callService.getUpdatedClientsGroupedByDate();
      return res.status(200).json({ updatedClientsByDate: groupedData });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };  
module.exports = {
    getCallCounts,
    getUpdatedClientsCount,
    getUpdatedClientsGroupedByDate
};
