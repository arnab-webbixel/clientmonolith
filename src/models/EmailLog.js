const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
  email: String,
  subject: String,
  body: String,
  status: { type: String, enum: ['sent', 'failed'] },
  error: String,
  sentAt: Date
});

module.exports = mongoose.model('EmailLog', emailLogSchema);
