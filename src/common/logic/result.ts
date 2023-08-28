type Error<P> = P | string | null;

type Value<P> = P | null;

export class Result<T> {
  readonly isSuccess: boolean;
  readonly isFailure: boolean;
  readonly error: Error<T>;
  private _value: Value<T>;

  protected constructor(
    isSuccess: boolean,
    error?: Error<T>,
    value?: Value<T>,
  ) {
    if (isSuccess && error) {
      throw new Error(
        'InvalidOperation: A result cannot be successful and contain an error',
      );
    }

    if (!isSuccess && !error) {
      throw new Error(
        'InvalidOperation: A failing result needs to contain an error message',
      );
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error ?? null;
    this._value = value ?? null;

    Object.freeze(this);
  }

  public getValue(): T {
    if (this.isFailure) {
      throw new Error(
        "Can't get the value of an error result. Use 'errorValue' instead.",
      );
    }

    return this._value as T;
  }

  public errorValue(): T {
    return this.error as T;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  public static fail<U>(error: any): Result<U> {
    return new Result<U>(false, error);
  }

  public static combine(results: Result<any>[]): Result<any> {
    for (const result of results) {
      if (result.isFailure) {
        return result;
      }
    }

    return Result.ok();
  }
}
