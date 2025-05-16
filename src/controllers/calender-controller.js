// In bulk-controller.js
const CalendarService = require('../services/calendar-service');
const Client = require('../models/client');

const generateCalendar = async (req, res) => {
  try {
    const { groupBy, month, year, date } = req.query;
    
    let query = Client.find();

    if (groupBy === 'month' && month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
      query = query.where('schedule_date').gte(startDate).lt(endDate);
    }

    if (groupBy === 'day' && date) {
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      query = query.where('schedule_date').gte(dayStart).lte(dayEnd);
    }

    const clients = await query
      .select('_id name call_type remarks schedule_date status')
      .populate('remarks', 'comment -_id')
      .sort({ schedule_date: 1 })
      .lean();

    if (!clients?.length) {
      return res.status(404).json({ message: 'No clients found' });
    }

    // ✅ Call stream-based ICS generator
    CalendarService.generateBulkCalendarStream(res, clients, groupBy);

  } catch (error) {
    console.error(`Calendar Error: ${error.stack}`);
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};



module.exports = {
  generateCalendar
}