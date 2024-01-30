import {
  HttpException,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  Scope,
} from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { configValidationSchema } from './common/config/config.schema';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AccessJwtGuard } from './auth/guards/at.guard';
import { AppController } from './app.controller';
import { HttpLoggerInterceptor } from './common/interceptors/http-logger.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    TasksModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [`${process.env.NODE_ENV}.env`],
      validationSchema: configValidationSchema,
      validationOptions: {
        allowUnknown: true, // allow env vars from .env but not mentioned in schema
        abortEarly: false, // validate the rest of env vars even if errors found
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: +config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    // apply guard globally to all APIs by default (can be set in main.ts file too)
    {
      provide: APP_GUARD,
      useClass: AccessJwtGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: HttpLoggerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(LoggerMiddleware)
  //     .exclude('(.*)/auth/(.*)') // auth requests' body may include passwords
  //     .forRoutes({ path: '*', method: RequestMethod.ALL });
  // }
}
