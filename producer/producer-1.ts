import { Kafka, Partitioners } from 'kafkajs';
import { WinstonLogCreator } from '../utils/logger';

(async () => {
  // สร้าง Kafka client
  const kafka = new Kafka({
    clientId: 'producer-1',
    brokers: ['localhost:9092'],
    logCreator: WinstonLogCreator,
  });

  // สร้าง producer
  const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });

  // เชื่อมต่อ producer
  await producer.connect();

  // ส่งข้อความไปยัง topic
  await producer.send({
    topic: 'my-topic',
    messages: [{ value: 'Hello Kafka!' }],
  });

  // ปิดการเชื่อมต่อ producer
  await producer.disconnect();
})();
