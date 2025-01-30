const ics = require('ics');
const moment = require('moment');

class CalendarService {
  static generateBulkCalendar(clients) {
    try {
      const events = clients
        .filter(client => client.schedule_date)
        .map(client => {
          // Convert to Moment.js for better date handling
          const scheduleMoment = moment(client.schedule_date);
          
          // Safely handle remarks with optional chaining and default
          const remarksText = client.remarks
            ?.map(remark => remark.comment || 'No comment')
            ?.join('\n') || 'No remarks available';

          return {
            start: [
              scheduleMoment.year(),
              scheduleMoment.month() + 1, // Months are 1-based in ICS
              scheduleMoment.date(),
              scheduleMoment.hours(),
              scheduleMoment.minutes()
            ],
            duration: { hours: 1 },
            title: `Client Meeting - ${client.call_type}`,
            description: [
              `Status: ${client.status}`,
              `Remarks: ${remarksText}`,
              `Schedule: ${scheduleMoment.format('YYYY-MM-DD HH:mm')}`
            ].join('\n'),
            status: 'CONFIRMED',
            alarms: [{
              action: 'display',
              trigger: { hours: 1, minutes: 0, before: true }
            }]
          };
        });

      if (events.length === 0) return null;

      const { error, value } = ics.createEvents(events);
      if (error) throw new Error(`ICS Generation Error: ${error.message}`);

      return value;
    } catch (error) {
      console.error('Calendar Service Error:', error);
      throw error; // Rethrow for controller handling
    }
  }
}


module.exports = CalendarService;