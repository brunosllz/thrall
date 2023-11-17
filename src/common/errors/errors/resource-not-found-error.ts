import { Result } from '@common/logic/result';

import { UseCaseError } from '../use-case-error';

export class ResourceNotFoundError extends Result<UseCaseError> {
  constructor() {
    super(false, 'Resource not found');
  }
}
