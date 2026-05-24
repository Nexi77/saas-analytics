import type { LogEvent } from "@repo/shared-types";

export class IngestLogCommand {
  constructor(public readonly logEvent: LogEvent) {}
}
