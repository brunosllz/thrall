import { BaseError } from './base-error';

export class AlreadyExistsError extends BaseError {
  constructor() {
    super({ code: 'CONFLICT', message: 'The resource already exists.' });
  }
}
