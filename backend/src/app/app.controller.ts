import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Тест')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/api/test')
  getHello(): string {
    return this.appService.getHello();
  }
}
