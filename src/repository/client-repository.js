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
      updateData.updatedAt = new Date();
      return await Client.findByIdAndUpdate(clientId, updateData, { new: true });
    }
  
    async deleteClient(clientId) {
      return await Client.findByIdAndDelete(clientId);
    }
    async addRemark(clientId, remark) {
      return await Client.findByIdAndUpdate(
        clientId,
        { $push: { remarks: remark } ,
        $set: { updatedAt: new Date() }
        },
        { new: true }
      );
    }
    async clientFilter (filters){
      return Client.find(filters)
    .sort({ updatedAt: -1 })
    .limit(100);
    }
    
  }
  
  
  module.exports = new ClientRepository();
  

  