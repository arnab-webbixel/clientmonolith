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



/**
 * Count clients whose updatedAt timestamp is greater than createdAt.
 * This implies the document has been updated after creation.
 * @returns {Promise<Number>} The count of updated client documents.
 */

const getUpdatedClientsCount = async () => {
    const result = await Client.aggregate([
      {
        $match: {
          $expr: { $gt: ["$updatedAt", "$createdAt"] }
        }
      },
      {
        $count: "updatedCount"
      }
    ]);
  
    // If no documents match, result will be an empty array.
    return result.length > 0 ? result[0].updatedCount : 0;
  };


  /**
 * Get updated clients grouped by update date.
 * Returns an array of objects where each object represents a day,
 * the list of updated clients on that day, and a count of those clients.
 */
const getUpdatedClientsByDate = async () => {
    return await Client.aggregate([
      // Match documents that have been updated (i.e. updatedAt > createdAt)
      { 
        $match: { 
          $expr: { $gt: ["$updatedAt", "$createdAt"] }
        }
      },
      // Project a field 'day' by converting updatedAt into a date string (YYYY-MM-DD)
      {
        $project: {
          name: 1,
          company_name: 1,
          phone: 1,
          email: 1,
          address: 1,
          industry_type: 1,
          service_type: 1,
          call_type: 1,
          remarks: 1,
          status: 1,
          updatedAt: 1,
          day: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } }
        }
      },
      // Group documents by the 'day' field
      {
        $group: {
          _id: "$day",
          updatedClients: { $push: "$$ROOT" },
          count: { $sum: 1 }
        }
      },
      // Sort by date descending (most recent first)
      { $sort: { _id: -1 } }
    ]);
  };



module.exports = {
    getCallCountsByType,
    getTotalCallCounts,
    getUpdatedClientsCount,
    getUpdatedClientsByDate
    
};