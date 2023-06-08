import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  sayHello(@Query('name') name: string) {
    return this.appService.sayHello(name);
  }
}
