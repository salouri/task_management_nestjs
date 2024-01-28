import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  Logger,
  RequestMethod,
  VERSION_NEUTRAL,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // log levels: error => warn => log => debug => verbose
    logger:
      process.env.NODE_ENV === 'production'
        ? ['log', 'error']
        : process.env.NODE_ENV === 'test'
          ? ['log', 'error', 'warn']
          : ['verbose'], //for development include everything
  });
  const logger = new Logger(AppModule.name);
  const config = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());

  // // make all APIs guarded unless assigned "isPublic: true" metadata
  // const reflector = new Reflector();  // reflector to read metadata
  // app.useGlobalGuards(new AccessJwtGuard(reflector));

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });

  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  //working with Exclude decorator
  app.useGlobalInterceptors(new TransformInterceptor());

  const port = config.get('APP_PORT');
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
