const clientRepository = require('../repository/client-repository');

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
  async addRemark(clientId, remark) {
    const client = await clientRepository.getClientById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }
    return await clientRepository.addRemark(clientId, remark);
  }
   // for bulk upload only
  async bulkCreateClients(clients) {
    return await Promise.all(
      clients.map(async (clientData) => {
        // You can add validation here
        return await clientRepository.createClient(clientData);
      })
    );
  }

  // Get all remarks for a specific client
  async getAllRemarks(clientId) {
    const client = await clientRepository.getClientById(clientId);
    if (!client) {
      throw new Error('Client not found');
    }
    return client.remarks.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sorting remarks by date in ascending order
  }
}

module.exports = new ClientService();
