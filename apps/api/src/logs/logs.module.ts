import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { LogsController } from "./logs.controller";
import { KafkaProducerService } from "./kafka-producer.service";
import { IngestLogHandler } from "./commands/ingest-log.handler";

@Module({
  imports: [CqrsModule.forRoot()],
  controllers: [LogsController],
  providers: [KafkaProducerService, IngestLogHandler],
})
export class LogsModule {}
