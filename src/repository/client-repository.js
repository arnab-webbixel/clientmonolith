const Client = require('../models/client');

class ClientRepository {
    async createClient(clientData) {
      const client = new Client(clientData);
      return await client.save();
    }
  
    async getAllClients() {
      return await Client.find().populate('updated_by');
    }
  
    async getClientById(clientId) {
      return await Client.findById(clientId).populate('updated_by');
    }
  
    async updateClient(clientId, updateData) {
      return await Client.findByIdAndUpdate(clientId, updateData, { new: true });
    }
  
    async deleteClient(clientId) {
      return await Client.findByIdAndDelete(clientId);
    }
  }
  
  module.exports = new ClientRepository();
  

  