import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { IngestLogDto } from "./dto/ingest-log.dto";
import { IngestLogCommand } from "./commands/ingest-log.command";

@Controller("logs")
export class LogsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async ingestLog(@Body() ingestLogDto: IngestLogDto) {
    try {
      await this.commandBus.execute(new IngestLogCommand(ingestLogDto));
      return { message: "Log ingestion started." };
    } catch (_) {
      throw new InternalServerErrorException("Failed to ingest log");
    }
  }
}
