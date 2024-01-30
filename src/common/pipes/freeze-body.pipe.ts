import {
  ArgumentMetadata,
  Injectable,
  Logger,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FreezeBodyPipe implements PipeTransform {
  private readonly logger = new Logger(FreezeBodyPipe.name);

  transform(value: any, metadata: ArgumentMetadata) {
    this.logger.debug('freezing object...');
    if (metadata.type === 'body') {
      Object.freeze(value);
    }
    return value;
  }
}
