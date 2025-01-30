const Client = require('../models/client');

class ClientRepository {
    async createClient(clientData) {
      const client = new Client(clientData);
      return await client.save();
    }
  
    async getAllClients() {
      return await Client.find();
    }
  
    async getClientById(clientId) {
      return await Client.findById(clientId);
    }
  
    async updateClient(clientId, updateData) {
      return await Client.findByIdAndUpdate(clientId, updateData, { new: true });
    }
  
    async deleteClient(clientId) {
      return await Client.findByIdAndDelete(clientId);
    }
    async addRemark(clientId, remark) {
      return await Client.findByIdAndUpdate(
        clientId,
        { $push: { remarks: remark } },
        { new: true }
      );
    }
    
  }
  
  
  module.exports = new ClientRepository();
  

  