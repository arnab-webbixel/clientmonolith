const clientService = require('../services/client-service');

class ClientController {
  async createClient(req, res) {
    try {
      const client = await clientService.createClient(req.body);
      res.status(201).json(client);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllClients(req, res) {
    try {
      const clients = await clientService.getAllClients();
      res.status(200).json(clients);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getClientById(req, res) {
    try {
      const client = await clientService.getClientById(req.params.id);
      res.status(200).json(client);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateClient(req, res) {
    try {
      const client = await clientService.updateClient(req.params.id, req.body);
      res.status(200).json(client);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteClient(req, res) {
    try {
      await clientService.deleteClient(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
  async addRemark(req, res) {
    try {
      const { id } = req.params; // Client ID
      const { comment } = req.body; // Remark details
  
      if (!comment) {
        return res.status(400).json({ error: 'Comment is required' });
      }
  
      const remark = {
        comment,
        date: new Date(),
      };
  
      const updatedClient = await clientService.addRemark(id, remark);
      res.status(200).json(updatedClient);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }
  // Get all remarks for a particular client sorted by date (ascending order)
  async getAllRemarks(req, res) {
    try {
      const clientId = req.params.id;
      const remarks = await clientService.getAllRemarks(clientId);
      res.status(200).json(remarks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

}

module.exports = new ClientController();