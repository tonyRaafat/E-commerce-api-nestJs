import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('debug-sentry')
  getError(): string {
    throw new Error('this is a test error to test sentry');
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
