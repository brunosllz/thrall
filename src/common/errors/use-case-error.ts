interface UseCaseErrorError {
  message: string;
}

export abstract class UseCaseError extends Error implements UseCaseErrorError {
  public readonly message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
  }
}
