export class EmailBadFormattedError extends Error {
  constructor(email: string) {
    super(`The email '${email}' is bad formatted.`);
    this.name = 'EmailBadFormatted';
  }
}
