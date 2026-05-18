import { Controller, Get } from '@nestjs/common';
import type { AppStatusResponse } from '@repo/shared-types';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): AppStatusResponse {
    return this.appService.getHello();
  }
}
