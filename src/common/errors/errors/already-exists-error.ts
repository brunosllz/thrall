import { UseCaseError } from '../use-case-error';

export class AlreadyExistsError extends UseCaseError {
  constructor(value: string) {
    super(`The ${value} already exists`);
  }
}
