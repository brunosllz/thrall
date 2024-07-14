import { BaseError } from './base-error';

export class InternalError extends BaseError {
  constructor() {
    super({
      code: 'INTERNAL_SERVER_ERROR',
      message:
        'An internal server error occurred. Please contact our support if the problem persists.',
    });
  }
}
