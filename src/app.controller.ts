import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { PublicApi } from './auth/decorator/public-api.decorator';

@Controller({ path: '/', version: '1' })
export class AppController {
  @PublicApi()
  @Get('/health')
  @HttpCode(HttpStatus.OK)
  getHealth(): void {}

  // below is just a demo route to test the exception filter
  @PublicApi()
  @Get('error')
  throwError() {
    throw new InternalServerErrorException();
  }
}
