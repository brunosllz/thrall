import { Result } from '@common/logic/result';

import { UseCaseError } from '../use-case-error';

export class NotAllowedError extends Result<UseCaseError> {
  constructor() {
    super(false, 'Not allowed');
  }
}
