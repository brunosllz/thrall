import { BaseError } from './base-error';

export class ResourceNotFoundError extends BaseError {
  constructor() {
    super({
      code: 'NOT_FOUND',
      message: 'The requested resource was not found.',
    });
  }
}
