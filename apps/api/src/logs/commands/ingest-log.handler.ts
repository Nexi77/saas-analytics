import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { IngestLogCommand } from "./ingest-log.command";
import { KafkaProducerService } from "../kafka-producer.service";
import { Logger } from "@nestjs/common/services/logger.service";
import { LogEvent } from "@repo/shared-types";

@CommandHandler(IngestLogCommand)
export class IngestLogHandler implements ICommandHandler<IngestLogCommand> {
  private readonly logger = new Logger(IngestLogHandler.name);

  private readonly TOPIC_NAME = "analytics.logs";

  constructor(private readonly kafkaProducer: KafkaProducerService) {}

  async execute(command: IngestLogCommand): Promise<void> {
    const { logEvent } = command;

    try {
      await this.kafkaProducer.send<LogEvent>(this.TOPIC_NAME, logEvent);
      // in a system with such high throughput logging every request like this would kill our disk
      // so in production we either use debug mode or metrics (fe. Prometheus counter)
      this.logger.debug(`Log ${logEvent.eventId} pushed to Redpanda.`);
    } catch (error) {
      this.logger.error(`Failed to push log ${logEvent.eventId} to Redpanda.`);
      throw error;
    }
  }
}
