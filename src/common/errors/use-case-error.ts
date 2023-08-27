interface UseCaseErrorError {
  message: string;
}

export abstract class UseCaseError implements UseCaseErrorError {
  public readonly message: string;

  constructor(message: string) {
    this.message = message;
  }
}
