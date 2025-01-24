const clientService = require('../service/clientService');

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
}

module.exports = new ClientController();