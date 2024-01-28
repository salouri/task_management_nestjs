import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { PublicApi } from './auth/decorator/public-api.decorator';

@Controller({ path: '/', version: '1' })
export class AppController {
  @PublicApi()
  @Get('/health')
  @HttpCode(HttpStatus.OK)
  getHealth(): void {}
}
