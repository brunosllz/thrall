export interface GuardResult {
  isSucceeded: boolean;
  isFailed: boolean;
  message?: string;
}

interface GuardArgument {
  argument: any;
  argumentName: string;
}

export type GuardArgumentCollection = GuardArgument[];

export class Guard {
  public static combine(guardResults: GuardResult[]): GuardResult {
    for (const result of guardResults) {
      if (result.isFailed) return result;
    }

    return { isSucceeded: true, isFailed: false };
  }

  public static againstNullOrUndefined(
    argument: any,
    argumentName: string,
  ): GuardResult {
    if (argument === null || argument === undefined) {
      return {
        isSucceeded: false,
        isFailed: true,
        message: `${argumentName} is null or undefined`,
      };
    } else {
      return { isSucceeded: true, isFailed: false };
    }
  }

  public static againstNullOrUndefinedBulk(
    args: GuardArgumentCollection,
  ): GuardResult {
    for (const arg of args) {
      const result = this.againstNullOrUndefined(
        arg.argument,
        arg.argumentName,
      );

      if (result.isFailed) return result;
    }

    return { isSucceeded: true, isFailed: false };
  }

  public static isOneOf(
    value: any,
    validValues: any[],
    argumentName: string,
  ): GuardResult {
    let isValid = false;
    for (const validValue of validValues) {
      if (value === validValue) {
        isValid = true;
      }
    }

    if (isValid) {
      return { isSucceeded: true, isFailed: false };
    }

    return {
      isSucceeded: false,
      isFailed: true,
      message: `${argumentName} isn't oneOf the correct types in ${JSON.stringify(
        validValues,
      )}. Got "${value}".`,
    };
  }

  public static inRange(
    num: number,
    min: number,
    max: number,
    argumentName: string,
  ): GuardResult {
    const isInRange = num >= min && num <= max;

    if (!isInRange) {
      return {
        isSucceeded: false,
        isFailed: true,
        message: `${argumentName} is not within range ${min} to ${max}.`,
      };
    }

    return { isSucceeded: true, isFailed: false };
  }

  public static allInRange(
    numbers: number[],
    min: number,
    max: number,
    argumentName: string,
  ): GuardResult {
    let failingResult: GuardResult | null = null;

    for (const num of numbers) {
      const numIsInRangeResult = this.inRange(num, min, max, argumentName);

      if (numIsInRangeResult.isFailed) failingResult = numIsInRangeResult;
    }

    if (failingResult) {
      return {
        isSucceeded: false,
        isFailed: true,
        message: `${argumentName} is not within the range.`,
      };
    }

    return { isSucceeded: true, isFailed: false };
  }
}
