const WebSocket = require("ws");
const amqp = require("amqplib");
require('dotenv').config();
const RABBITMQ_USER = 'vais' ;
const RABBITMQ_PASS = '12345' ;
const wss = new WebSocket.Server({ host: '0.0.0.0',port: 8082}); 
let clients = []; 

wss.on("connection", (ws) => {
  console.log("New client connected");
  clients.push(ws);

  ws.on("close", () => {
    clients = clients.filter((client) => client !== ws);
  });
});

async function startNotificationConsumer() {
  try {
    const connection = await amqp.connect(`amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@localhost:5672`);
    const channel = await connection.createChannel();
    const queue = "customer_notifications";

    await channel.assertQueue(queue, { durable: true });
    console.log("Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const message = JSON.parse(msg.content.toString());
        
        // Broadcast the message to all WebSocket clients
        clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            console.log("Sending message to client:", message);
            client.send(JSON.stringify(message));
          }
        });

        channel.ack(msg);
      }
    }, { noAck: false });
  } catch (error) {
    console.error("Error in consumer:", error);
  }
}

startNotificationConsumer();
