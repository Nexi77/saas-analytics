import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from "@nestjs/common";
import { Kafka, Producer, Partitioners } from "kafkajs";

@Injectable()
export class KafkaProducerService
  implements OnModuleInit, OnApplicationShutdown
{
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly logger = new Logger(KafkaProducerService.name);
  private readonly brokers: string[];

  constructor() {
    this.brokers = (process.env.KAFKA_BROKERS || "localhost:19092")
      .split(",")
      .map((broker) => broker.trim())
      .filter(Boolean);

    this.kafka = new Kafka({
      clientId: "api-gateway",
      brokers: this.brokers,
    });

    this.producer = this.kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    });
  }

  async onModuleInit() {
    this.logger.log(`Connecting to Redpanda via: ${this.brokers.join(", ")}`);
    await this.producer.connect();
    this.logger.log("Connected to Redpanda successfully.");
  }

  async onApplicationShutdown(signal?: string) {
    this.logger.log(
      `Received shutdown signal: ${signal}. Disconnecting from Redpanda...`,
    );
    await this.producer.disconnect();
    this.logger.log("Disconnected from Redpanda successfully.");
  }

  async send<T>(topic: string, message: T, key?: string) {
    await this.producer.send({
      topic,
      messages: [{ key, value: JSON.stringify(message) }],
    });
  }
}
