// import { makeFakeUser } from '@test/factories/make-user';

// import { Email } from './value-objects/email';
// import { EmailBadFormattedError } from './value-objects/errors/email-bad-formatted-error';

// describe('User', () => {
//   it('should be able create an user', () => {
//     const user = makeFakeUser({
//       name: 'bruno silveira luiz',
//     });

//     expect(user).toBeTruthy();
//     expect(user.id).toEqual(expect.any(String));
//     expect(user).toEqual(
//       expect.objectContaining({
//         name: 'bruno silveira luiz',
//       }),
//     );
//   });

//   it('should be not able create an user with invalid email format', () => {
//     const user = makeFakeUser({
//       email: Email.create('invalid-email').value as Email,
//     });

//     expect(user.email).toBeInstanceOf(EmailBadFormattedError);
//   });
// });
