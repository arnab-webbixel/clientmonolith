const parseExcel = require('../utils/excelParser');
const { sendBulkEmails } = require('../services/email.service');
const path = require('path');
const EmailLog = require('../models/EmailLog');

const uploadAndSendEmails = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = req.file.path; // ✅ This is correct now
    const rows = parseExcel(filePath);
    const results = await sendBulkEmails(rows);
    
    res.status(200).json({ 
      success:true,
      message: 'Emails processed',
      data: results });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to process file' });
  }
};


const getAllEmailLogs = async (req, res) => {
  try {
    const logs = await EmailLog.find().sort({ sentAt: -1 }); // Most recent first
    res.status(200).json({ 
      success:true ,
      message: 'all email fetched',
      data:logs });
  } catch (err) {
    console.error('Fetch logs error:', err);
    res.status(500).json({ error: 'Failed to fetch email logs' });
  }
};

module.exports = { uploadAndSendEmails , getAllEmailLogs };
