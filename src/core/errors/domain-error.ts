import { BaseError } from './base-error';

export class domainError extends BaseError {
  constructor(message: string) {
    super({
      code: 'UNPROCESSABLE_ENTITY',
      message,
    });
  }
}
