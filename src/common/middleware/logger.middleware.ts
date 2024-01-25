import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('Middleware');
  use(req: Request, res: Response, next: NextFunction): void {
    const { body, method, path: url } = req;

    res.on('close', () => {
      const { statusCode } = res;

      this.logger.log(
        `${method} ${url} ${statusCode} - Body:${JSON.stringify(body)}`,
      );
    });
    next();
  }
}
