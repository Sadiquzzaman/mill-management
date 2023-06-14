import {
  ArgumentMetadata,
  Injectable,
  Optional,
  ParseUUIDPipeOptions,
  PipeTransform,
} from '@nestjs/common';
import { UuidValidationException } from '../exceptions/validations/uuid-validation.exception';
import { isUUID } from 'class-validator';

@Injectable()
export class UuidValidationPipe implements PipeTransform<string> {
  private readonly version: '3' | '4' | '5';

  constructor(@Optional() options?: ParseUUIDPipeOptions) {
    options = options || {};
    const { version } = options;
    this.version = version;
  }

  async transform(value: string, metadata: ArgumentMetadata): Promise<string> {
    if (!isUUID(value, this.version)) {
      throw new UuidValidationException(
        metadata.data,
        value,
        this.version,
        'UUID Validation Error',
      );
    }
    return value;
  }
}
