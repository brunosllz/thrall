import { UseCaseError } from '../use-case-error';

export class NotAllowedError extends UseCaseError {
  constructor() {
    super('Not allowed');
  }
}
