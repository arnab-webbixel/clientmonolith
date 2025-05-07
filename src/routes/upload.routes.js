const express = require('express');
const multer = require('multer');
const { uploadAndSendEmails  ,getAllEmailLogs} = require('../controllers/upload.controller');

const router = express.Router();
const upload = multer({ dest: 'upload/' });

router.post('/upload', upload.single('file'), uploadAndSendEmails);
router.get('/logs', getAllEmailLogs); 
module.exports = router;
