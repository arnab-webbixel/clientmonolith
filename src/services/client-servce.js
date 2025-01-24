const clientRepository = require('../repository/clientRepository');

class ClientService {
  async createClient(clientData) {
    return await clientRepository.createClient(clientData);
  }

  async getAllClients() {
    return await clientRepository.getAllClients();
  }

  async getClientById(clientId) {
    const client = await clientRepository.getClientById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }
    return client;
  }

  async updateClient(clientId, updateData) {
    return await clientRepository.updateClient(clientId, updateData);
  }

  async deleteClient(clientId) {
    const client = await clientRepository.getClientById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }
    return await clientRepository.deleteClient(clientId);
  }
}

module.exports = new ClientService();
