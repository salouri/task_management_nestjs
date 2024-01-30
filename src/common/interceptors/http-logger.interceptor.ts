import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HttpLoggerInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const userAgent = request.get('user-agent') || '';
    const { ip, method, path: url } = request;
    // context.getClass(): get the controller class the current handler belongs to
    this.logger.log(
      `${method} ${url} ${userAgent} ${ip}: ${context.getClass().name} ${context.getHandler().name} invoked...`,
    );

    this.logger.debug(`userId: ${request?.user?.id}`);

    const now = Date.now();
    return next.handle().pipe(
      tap((res) => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const contentLength = response.get('conten-length');
        this.logger.log(
          `${method} ${url} ${statusCode} ${userAgent} ${ip}: ${context.getClass().name} ${context.getHandler().name} ${Date.now() - now}ms`,
        );

        this.logger.debug(`Response: ${JSON.stringify(res)}`);
      }),
    );
  }
}
