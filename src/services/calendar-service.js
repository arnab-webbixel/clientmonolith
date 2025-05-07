const ics = require('ics');
const moment = require('moment');
class CalendarService {
  // static generateBulkCalendar(clients, groupBy = null) {
  //   try {
  //     const events = clients
  //       .filter(client => client.schedule_date)
  //       .map(client => {
  //         // Convert to Moment.js for better date handling
  //         console.log('Processing client:', client);
  //         const scheduleMoment = moment(client.schedule_date);
          
  //         // Safely handle remarks with optional chaining and default
  //         const remarksText = client.remarks
  //           ?.map(remark => remark.comment || 'No comment')
  //           ?.join('\n') || 'No remarks available';

  //         // Add grouping info to description if groupBy is provided
  //         const groupInfo = groupBy
  //           ? groupBy === 'month'
  //             ? `Month: ${scheduleMoment.format('MMMM YYYY')}\n`
  //             : `Day: ${scheduleMoment.format('YYYY-MM-DD')}\n`
  //           : '';

  //         return {
  //           start: [
  //             scheduleMoment.year(),
  //             scheduleMoment.month() + 1, // Months are 1-based in ICS
  //             scheduleMoment.date(),
  //             scheduleMoment.hours(),
  //             scheduleMoment.minutes()
  //           ],
  //           duration: { hours: 1 },
  //           title: `Meeting with ${client.name} - ${client.call_type}`,
  //           description: [
  //             groupInfo, // Add grouping info if applicable
  //             `Client: ${client.name}`,
  //             `Status: ${client.status}`,
  //             `Remarks: ${remarksText}`,
  //             `Schedule: ${scheduleMoment.format('YYYY-MM-DD HH:mm')}`
  //           ].join('\n'),
  //           status: 'CONFIRMED',
  //           alarms: [{
  //             action: 'display',
  //             trigger: { hours: 1, minutes: 0, before: true }
  //           }]
  //         };
  //       });

  //     if (events.length === 0) return null;

  //     const { error, value } = ics.createEvents(events);
  //     if (error) throw new Error(`ICS Generation Error: ${error.message}`);

  //     return value;
  //   } catch (error) {
  //     console.error('Calendar Service Error:', error);
  //     throw error; // Rethrow for controller handling
  //   }
  // }

  static generateBulkCalendar(clients, groupBy = null) {
    try {
      const events = clients
        .filter(client => client.schedule_date)
        .map(client => {
          const scheduleMoment = moment(client.schedule_date);
          
          const remarksText = client.remarks
            ?.map(remark => remark.comment || 'No comment')
            .join('\n') || 'No remarks available';

          const groupInfo = groupBy
            ? (groupBy === 'month'
                ? `Month: ${scheduleMoment.format('MMMM YYYY')}\n`
                : `Day: ${scheduleMoment.format('YYYY-MM-DD')}\n`)
            : '';

          return {
            // Use MongoDB _id as the ICS UID
            uid: client._id.toString(), 

            start: [
              scheduleMoment.year(),
              scheduleMoment.month() + 1,
              scheduleMoment.date(),
              scheduleMoment.hours(),
              scheduleMoment.minutes()
            ],
            duration: { hours: 1 },
            title: `Meeting with ${client.name} - ${client.call_type}`,
            description: [
              groupInfo,
              `Client ID: ${client._id}`,
              `Client: ${client.name}`,
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

      if (!events.length) {
        return '';
      }

      const { error, value } = ics.createEvents(events);
      if (error) {
        throw new Error(`ICS Generation Error: ${error.message}`);
      }
      return value;
    } catch (error) {
      console.error('Calendar Service Error:', error);
      throw error;
    }
  }
}

module.exports = CalendarService;