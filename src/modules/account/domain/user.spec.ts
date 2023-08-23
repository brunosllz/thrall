import { makeFakeUser } from '@test/factories/make-user';

import { Email } from './value-objects/email';
import { EmailBadFormattedError } from './value-objects/errors/email-bad-formatted-error';

describe('User', () => {
  it('should be not able create a user with invalid email format', () => {
    const user = makeFakeUser({
      email: Email.create('invalid-email').value as Email,
    });

    expect(user.email).toBeInstanceOf(EmailBadFormattedError);
  });
});
