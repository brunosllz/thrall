import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthUser } from './auth-user';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): AuthUser => {
    return context.switchToHttp().getRequest().user;
  },
);
