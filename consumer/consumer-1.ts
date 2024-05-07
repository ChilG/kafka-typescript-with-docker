import { Kafka } from 'kafkajs';
import { WinstonLogCreator } from '../utils/logger';

(async () => {
  // สร้าง Kafka client
  const kafka = new Kafka({
    clientId: 'consumer-1',
    brokers: ['localhost:9092'],
    logCreator: WinstonLogCreator,
  });

  // สร้าง consumer
  const consumer = kafka.consumer({ groupId: 'my-group' });

  // เชื่อมต่อ consumer
  await consumer.connect();

  // subscribe ไปยัง topic
  await consumer.subscribe({ topic: 'my-topic', fromBeginning: true });

  // consume messages
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message: ${message.value}`);
    },
  });
})();
