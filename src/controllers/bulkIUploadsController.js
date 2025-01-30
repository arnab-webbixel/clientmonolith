const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser'); 
const xlsx = require('xlsx'); 
const clientService = require('../services/client-service');;

class BulkController {
  async bulkUploadClients(req, res) {
    try {
      console.log('Uploaded File:', req.file); // Debugging
      console.log(req.body);  // Log the other form fields


      const filePath = req.file.path; // Path to the uploaded file
      const fileExtension = path.extname(req.file.originalname).toLowerCase();

      let clients = [];
    if(!filePath) {
      return res.status(400).json({error:'upload file require'})
    }

      if (fileExtension === '.csv') {
        // Parse CSV file
        clients = await parseCSV(filePath);
      } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
        // Parse Excel file
        clients = parseExcel(filePath);
      } else {
        return res.status(400).json({ error: 'Invalid file type. Only CSV or Excel files are allowed.' });
      }


       clients = await parseCSV(filePath);
       console.log('Parsed Clients:', clients);
       const validClients = clients.map(client => {
        // Ensure remarks is an array of objects
        if (client.remarks && typeof client.remarks === 'string') {
          client.remarks = [{ comment: client.remarks }];
        }
      
        return client;
      })
       .filter(client => 
        client.name &&
        client.company_name &&
        client.phone &&
        client.email &&
        client.address &&
        client.industry_type &&
        client.service_type &&
        client.call_type &&
        client.schedule_date &&
        client.status
       );
       if (validClients.length !== clients.length) {
        console.log(`Removed ${clients.length - validClients.length} invalid records.`);
    }
    
    if (validClients.length === 0) {
        return res.status(400).json({
            error: 'All records are invalid. Please ensure the CSV file contains all required fields.',
        });
    }
    
      // Save clients to the database
      const results = await clientService.bulkCreateClients(clients);

      // Cleanup uploaded file
      fs.unlinkSync(filePath);

      res.status(200).json({ message: `${results.length} clients successfully added.`, clients: results });
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: error.message });
    }
  }
}

// Helper functions
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const clients = [];
    fs.createReadStream(filePath)
      .pipe(csvParser({ separator: ',' }))
      .on('data', (row) => clients.push(row))
      .on('end', () => resolve(clients))
      .on('error', (error) => reject(error));
  });
};

const parseExcel = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet);
};

module.exports = new BulkController();
