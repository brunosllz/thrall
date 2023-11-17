import { Result } from '@common/logic/result';

import { UseCaseError } from '../use-case-error';

export class AlreadyExistsError extends Result<UseCaseError> {
  constructor(value: string) {
    super(false, `The ${value} already exists`);
  }
}
