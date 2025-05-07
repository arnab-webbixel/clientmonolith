const clientService = require('../services/client-service');

class ClientController {
  async createClient(req, res) {
    try {
      const client = await clientService.createClient(req.body);
      return res.status(201).json({
        success: true,
        message: 'Customer added successfully',
        data: client
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Something went wrong'
      });
    }
  }

  async getAllClients(req, res) {
    try {
      const clients = await clientService.getAllClients();
      return res.status(200).json({
        success: true,
        message: 'All customers fetched successfully',
        data: clients
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getClientById(req, res) {
    try {
      const client = await clientService.getClientById(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Customer fetched successfully',
        data: client
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateClient(req, res) {
    try {
      const client = await clientService.updateClient(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Customer updated successfully',
        data: client
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteClient(req, res) {
    try {
      await clientService.deleteClient(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Customer deleted successfully'
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async addRemark(req, res) {
    try {
      const { id } = req.params;       // Client ID
      const { comment } = req.body;    // Remark text

      if (!comment) {
        return res.status(400).json({
          success: false,
          message: 'Comment is required'
        });
      }

      const remark = { comment, date: new Date() };
      const updatedClient = await clientService.addRemark(id, remark);

      return res.status(200).json({
        success: true,
        message: 'Remark added successfully',
        data: updatedClient
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAllRemarks(req, res) {
    try {
      const clientId = req.params.id;
      const remarks = await clientService.getAllRemarks(clientId);
      return res.status(200).json({
        success: true,
        message: 'Remarks fetched successfully',
        data: remarks
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async clientFilter (req, res,){
    try {
      const clients = await fetchClients(req.query);
      res.status(200).json({
         success: true, 
        message: "ok",
        data: clients });
    } catch (err) {
      res.status(500).status({
        success: false,
        message: "falied",
        data:err
      })
    }
  }
}

module.exports = new ClientController();
