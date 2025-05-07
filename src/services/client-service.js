const clientRepository = require('../repository/client-repository');
const amqp = require('amqplib');
class ClientService {

  async sendNotificationToQueue(message) {
    try {
      const connection = await amqp.connect('amqp://vais:12345@rabbitmq-notification:5672');
      const channel = await connection.createChannel();

      const queue = 'customer_notifications'; // Queue name
      await channel.assertQueue(queue, { durable: true }); // Ensure the queue exists

      // Send the message (you can adjust the content of the message as needed)
      channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
      console.log('Notification sent to queue:', message);

      // Close the channel and connection after sending the message
      await channel.close();
      await connection.close();
    } catch (error) {
      console.error('Error sending message to RabbitMQ:', error);
    }
  }

  async createClient(clientData) {
    try {
      const client = await clientRepository.createClient(clientData);

      // After client is created, send a notification via RabbitMQ
      const message = JSON.stringify({
        type: 'new_customer',
        name: client.name,
        email: client.email,
        phone: client.phone,
        company_name: client.company_name
      });

      // await this.sendNotificationToQueue(message);  // Send the notification message

      return client;
    } catch (error) {
      throw new Error('Error creating client: ' + error);
    }
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

  async clientFilter(queryParams){
    const { callType, status, start, end } = queryParams;
    const filter = {};
  
    if (callType) filter.call_type = callType;
    if (status) filter.status = status;
    if (start || end) {
      filter.updatedAt = {};
      if (start) filter.updatedAt.$gte = new Date(start);
      if (end) filter.updatedAt.$lte = new Date(end);
    }
  
    return await getClients(filter);
  }
}

module.exports = new ClientService();
