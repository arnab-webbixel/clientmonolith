const express = require('express');
const clientController = require('../controllers/clientController');
const bulkUploadsController = require('../controllers/bulkIUploadsController');
const upload = require('../config/multer-config'); 
const callController = require('../controllers/callController');
const {generateCalendar} = require('../controllers/calender-controller');

const router = express.Router();



router.get('/calendar', generateCalendar);


router.get('/call-counts', (req, res, next) => {
    console.log('Request Path:', req.path); 
    console.log('Query Parameters:', req.query); 
    next();
}, callController.getCallCounts);

// Get all remarks for a particular client sorted by date (ascending)
router.get('/:id/remarks', clientController.getAllRemarks);


router.post('/', clientController.createClient);
router.get('/', clientController.getAllClients);
router.get('/:id', clientController.getClientById);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);
router.post('/:id/remarks', clientController.addRemark);



router.post('/bulk-uploads', upload.single('file'), bulkUploadsController.bulkUploadClients);




module.exports = router;