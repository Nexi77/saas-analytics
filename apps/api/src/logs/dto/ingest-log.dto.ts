import type { LogEvent, LogLevel } from "@repo/shared-types";
import {
  IsUUID,
  IsISO8601,
  IsString,
  IsNotEmpty,
  IsEnum,
  IsObject,
} from "class-validator";

export enum LogLevelEnum {
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
  DEBUG = "debug",
}

export class IngestLogDto implements LogEvent {
  @IsUUID("4")
  eventId!: string;

  @IsISO8601()
  timestamp!: string;

  @IsString()
  @IsNotEmpty()
  source!: string;

  @IsEnum(LogLevelEnum)
  level!: LogLevel;

  @IsObject()
  metadata!: Record<string, unknown>;
}
