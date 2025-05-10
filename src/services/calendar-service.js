const ics = require('ics');
const moment = require('moment');
const ical = require('ical-generator').default;

class CalendarService {


  // static generateBulkCalendar(clients, groupBy = null) {
  //   try {
  //     const events = clients
  //       .filter(client => client.schedule_date)
  //       .map(client => {
  //         const scheduleMoment = moment(client.schedule_date);
          
  //         const remarksText = client.remarks
  //           ?.map(remark => remark.comment || 'No comment')
  //           .join('\n') || 'No remarks available';

  //         const groupInfo = groupBy
  //           ? (groupBy === 'month'
  //               ? `Month: ${scheduleMoment.format('MMMM YYYY')}\n`
  //               : `Day: ${scheduleMoment.format('YYYY-MM-DD')}\n`)
  //           : '';

  //         return {
  //           // Use MongoDB _id as the ICS UID
  //           uid: client._id.toString(), 

  //           start: [
  //             scheduleMoment.year(),
  //             scheduleMoment.month() + 1,
  //             scheduleMoment.date(),
  //             scheduleMoment.hours(),
  //             scheduleMoment.minutes()
  //           ],
  //           duration: { hours: 1 },
  //           title: `Meeting with ${client.name} - ${client.call_type}`,
  //           description: [
  //             groupInfo,
  //             `Client ID: ${client._id}`,
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

  //     if (!events.length) {
  //       return '';
  //     }

  //     const { error, value } = ics.createEvents(events);
  //     if (error) {
  //       throw new Error(`ICS Generation Error: ${error.message}`);
  //     }
  //     return value;
  //   } catch (error) {
  //     console.error('Calendar Service Error:', error);
  //     throw error;
  //   }
  // }

 static generateBulkCalendarStream(res, clients, groupBy = null) {
    const calendar = ical();
    calendar.name('Client Schedule');

    clients.forEach(client => {
      const scheduleDate = new Date(client.schedule_date);

      const remarksText = client.remarks?.map(r => r.comment || 'No comment').join('\n') || 'No remarks available';

      const groupInfo = groupBy
        ? (groupBy === 'month'
            ? `Month: ${scheduleDate.toLocaleString('default', { month: 'long', year: 'numeric' })}\n`
            : `Day: ${scheduleDate.toISOString().slice(0, 10)}\n`)
        : '';

      const formattedDate = scheduleDate.toISOString().slice(0, 16).replace('T', ' ');

      calendar.createEvent({
        id: client._id.toString(),
        start: scheduleDate,
        end: new Date(scheduleDate.getTime() + 60 * 60 * 1000),
        summary: `Meeting with ${client.name} - ${client.call_type}`,
        description: [
          groupInfo,
          `Client ID: ${client._id}`,
          `Client: ${client.name}`,
          `Status: ${client.status}`,
          `Remarks: ${remarksText}`,
          `Schedule: ${formattedDate}`
        ].join('\n'),
        alarms: [{
          type: 'display',
          trigger: 60 * 60
        }]
      });
    });

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="client-calendar.ics"');
    res.send(calendar.toString());
  }
}

module.exports = CalendarService;