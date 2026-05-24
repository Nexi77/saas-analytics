export interface AppStatusResponse {
  message: string;
  status: "OK";
}

export type LogLevel = "error" | "warning" | "info" | "debug";

export interface LogEvent {
  eventId: string;
  timestamp: string;
  source: string;
  level: LogLevel;
  metadata: Record<string, unknown>;
}
