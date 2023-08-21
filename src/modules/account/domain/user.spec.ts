import { User } from './user';
import { Email } from './value-objects/email';
import { EmailBadFormattedError } from './value-objects/errors/email-bad-formatted-error';

describe('User', () => {
  it('should be not able create a user with invalid email format', () => {
    const user = User.create({
      avatarUrl: 'any',
      bio: 'any',
      email: Email.create('invalid-email').value as Email,
      name: 'any',
      occupation: 'any',
      socialMedia: {
        githubLink: 'any',
        linkedinLink: 'any',
      },
      address: {
        city: 'somewhere',
        country: 'any',
        state: 'any',
      },
    });

    expect(user.email).toBeInstanceOf(EmailBadFormattedError);
  });
});
