import { Injectable } from '@nestjs/common';
import type { AppStatusResponse } from '@repo/shared-types';

@Injectable()
export class AppService {
  getHello(): AppStatusResponse {
    return { message: 'API is running', status: 'OK' };
  }
}
