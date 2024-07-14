enum errorCode {
  'BAD_REQUEST' = 'bad_request',
  'NOT_FOUND' = 'not_found',
  'INTERNAL_SERVER_ERROR' = 'internal_server_error',
  'UNAUTHORIZED' = 'unauthorized',
  'FORBIDDEN' = 'forbidden',
  'CONFLICT' = 'conflict',
  'UNPROCESSABLE_ENTITY' = 'unprocessable_entity',
}

interface BaseErrorProps {
  code: keyof typeof errorCode;
  message: string;
}

export abstract class BaseError extends Error {
  protected code: errorCode;

  constructor({ code, message }: BaseErrorProps) {
    super(message);
    this.code = errorCode[code];
  }

  getErrorValue() {
    return {
      code: this.code,
      message: this.message,
    };
  }
}
