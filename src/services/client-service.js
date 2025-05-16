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

  async createClient(data, user) {
    try {
      const client = await clientRepository.createClient({...data, 
         added_by: {
          id: user.id,
          role: user.role,
          name: user.name || null,
          email: user.email
        }}
      );

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

  async getAllClients({ page, limit, search, call_type, status, schedule_date }) {
    try {

      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 10);
      const skip = (pageNum - 1) * limitNum;

      const filter = {};

      if (search) {
        const term = search.trim();
        filter.$or = [
          { name: new RegExp(term, 'i') },
          { email: new RegExp(term, 'i') }
        ];
      }

      if (call_type) filter.call_type = call_type;
      if (status) filter.status = status;
      if (schedule_date) {
        const isoDateRE = /^\d{4}-\d{2}-\d{2}$/;
        if (!isoDateRE.test(schedule_date)) {
          throw new Error("Invalid schedule_date format. Use 'YYYY-MM-DD'.");
        }
        // to match on a specific date (ignoring time) we can do a day-range
        const d = new Date(schedule_date);
        const next = new Date(d);
        next.setDate(d.getDate() + 1);
        filter.schedule_date = { $gte: d, $lt: next };
      }
      return await clientRepository.getAllClients({ limit: limitNum, page: pageNum, skip, filter });
    } catch (error) {
      throw error;
    }
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

  async clientFilter(queryParams) {
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
