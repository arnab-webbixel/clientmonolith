const client = require('../models/client');
const Client = require('../models/client');

class ClientRepository {
  async createClient(clientData) {
    const client = new Client(clientData);
    return await client.save();
  }

  async getAllClients({ page, limit, skip, filter }) {
  try {
    console.log("client", client)
    // 1) Count total matching documents
    const total = await Client.countDocuments(filter);
    const totalPages = Math.ceil(total / limit) || 1;

    // 2) If the requested page is too big, reset to 1
    let pageNum = page;
    let realSkip = skip;
    if (pageNum > totalPages) {
      pageNum = 1;
      realSkip = 0;
    }

    // 3) Fetch the docs
    const clients = await Client.find(filter)
      .sort({ createdAt: -1 })
      .skip(realSkip)
      .limit(limit);

    // 4) Return metadata & data
    return {
      page:       pageNum,
      limit,
      total,
      totalPages,
      data:       clients
    };
  } catch (error) {
    throw error;
  }
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
      {
        $push: { remarks: remark },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    );
  }
  async clientFilter(filters) {
    return Client.find(filters)
      .sort({ updatedAt: -1 })
      .limit(100);
  }

}


module.exports = new ClientRepository();


