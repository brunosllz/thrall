import { BaseError } from './base-error';

export class NotAllowedError extends BaseError {
  constructor() {
    super({
      code: 'UNAUTHORIZED',
      message: 'Has not permission to access this resource.',
    });
  }
}
