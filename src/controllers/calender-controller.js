// In bulk-controller.js
const CalendarService = require('../services/calendar-service');
// const clientService = require('../services/client-service');
const Client = require('../models/client');

//  const generateCalendar = async (req, res) => {
//   try {
    
//     const { groupBy, month, year, date } = req.query;
    
//     // Base query
//     let query = Client.find();

//     if (groupBy === 'month' && month && year) {
//       const startDate = new Date(year, month-1, 1);
//       const endDate = new Date(year, month, 1);
      
//       query = query.where('schedule_date').gte(startDate).lt(endDate);
//     }

//     // Filter by day (e.g., date=2023-07-15)
//     if (groupBy === 'day' && date) {
//       const dayStart = new Date(date);
//       dayStart.setHours(0,0,0,0);
      
//       const dayEnd = new Date(date);
//       dayEnd.setHours(23,59,59,999);

//       query = query.where('schedule_date').gte(dayStart).lte(dayEnd);
//     }

//     // Execute query
//     const clients = await query
//       .select('name call_type remarks schedule_date status')
//       .populate('remarks', 'comment -_id')
//       .sort({ schedule_date: 1 }) // Sort ascending
//       .lean();

//     // Add validation for required calendar fields
//     if (!clients?.length) {
//       return res.status(404).json({ message: 'No clients found' });
//     }

//     const icsContent = CalendarService.generateBulkCalendar(clients);
    
//     // ... rest remains the same
//     res.setHeader('Content-Type', 'text/calendar');
//     res.setHeader('Content-Disposition', 'attachment; filename="client-calendar.ics"');
    
//     return res.send(icsContent);
    
//   } catch (error) {
//     // Improved error logging
//     console.error(`Calendar Error: ${error.stack}`);
//     res.status(500).json({ 
//       error: 'Internal server error',
//       details: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };


const generateCalendar = async (req, res) => {
  try {
    const { groupBy, month, year, date } = req.query;
    
    // Base query
    let query = Client.find();

    if (groupBy === 'month' && month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
      query = query.where('schedule_date').gte(startDate).lt(endDate);
    }

    if (groupBy === 'day' && date) {
      const dayStart = new Date(date);
      dayStart.setHours(0,0,0,0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23,59,59,999);
      query = query.where('schedule_date').gte(dayStart).lte(dayEnd);
    }

    // include _id so we can use it as event UID
    const clients = await query
      .select('_id name call_type remarks schedule_date status')
      .populate('remarks', 'comment -_id')
      .sort({ schedule_date: 1 })
      .lean();

    if (!clients?.length) {
      return res.status(404).json({ message: 'No clients found' });
    }

    const icsContent = CalendarService.generateBulkCalendar(clients, groupBy);

    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', 'attachment; filename="client-calendar.ics"');
    return res.send(icsContent);
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