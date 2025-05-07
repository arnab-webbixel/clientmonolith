const transporter = require('../utils/mail');
const EmailLog = require('../models/EmailLog');

async function sendBulkEmails(rows) {
  const results = [];

  for (const row of rows) {
    const { email, subject, body } = row;
    let status = 'sent';
    let error = null;

    try {
      await transporter.sendMail({
        from: `"CRM Bot" <${process.env.SMTP_USER}>`,
        to: email,
        subject,
        html: body
      });
    } catch (err) {
      status = 'failed';
      error = err.message;
    }

    const log = new EmailLog({
      email,
      subject,
      body,
      status,
      error,
      sentAt: new Date()
    });

    await log.save();
    results.push(log);
  }

  return results;
}

module.exports = { sendBulkEmails };
