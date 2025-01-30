// In bulk-controller.js
const CalendarService = require('../services/calendar-service');
// const clientService = require('../services/client-service');
const Client = require('../models/client');

 const generateCalendar = async (req, res) => {
  try {
    // Add query filter to ensure no ID is passed accidentally
    const clients = await Client.find({}) 
      .select('call_type remarks schedule_date status')
      .populate({
        path: 'remarks',
        select: 'comment -_id'
      })
      .lean();

    // Add validation for required calendar fields
    if (!clients?.length) {
      return res.status(404).json({ message: 'No clients found' });
    }

    const icsContent = CalendarService.generateBulkCalendar(clients);
    
    // ... rest remains the same
    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', 'attachment; filename="client-calendar.ics"');
    
    return res.send(icsContent);
    
  } catch (error) {
    // Improved error logging
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