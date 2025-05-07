const ExcelJS = require('exceljs');
const clientService = require('../services/client-service');

async function exportClientsExcel(req, res) {
  try {
    const clients = await clientService.getAllClients();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Clients');

    // Define columns
    worksheet.columns = [
      { header: 'ID', key: '_id', width: 24 },
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Company Name', key: 'company_name', width: 25 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Address', key: 'address', width: 30 },
      { header: 'Industry Type', key: 'industry_type', width: 20 },
      { header: 'Service Type', key: 'service_type', width: 20 },
      { header: 'Call Type', key: 'call_type', width: 15 },
      { header: 'Schedule Date', key: 'schedule_date', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Pipeline Stage', key: 'pipeline_stage', width: 20 },
      { header: 'Price', key: 'price', width: 10 }
    ];

    // Add rows
    clients.forEach(client => {
      worksheet.addRow({
        _id: client._id.toString(),
        name: client.name,
        company_name: client.company_name,
        phone: client.phone,
        email: client.email,
        address: client.address,
        industry_type: client.industry_type,
        service_type: client.service_type,
        call_type: client.call_type,
        schedule_date: client.schedule_date ? new Date(client.schedule_date).toISOString().split('T')[0] : '',
        status: client.status,
        pipeline_stage: client.pipeline_stage || '',
        price: client.price || ''
      });
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=clients_export.xlsx');

    // Write workbook to response
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Error exporting Excel:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to export clients',
      error: err.message
    });
  }
}

module.exports = { exportClientsExcel };
