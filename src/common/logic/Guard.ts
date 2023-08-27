export interface IGuardResult {
  succeeded: boolean;
  failed: boolean;
  message?: string;
}

export interface IGuardArgument {
  argument: any;
  argumentName: string;
}

export type GuardArgumentCollection = IGuardArgument[];

export class Guard {
  public static combine(guardResults: IGuardResult[]): IGuardResult {
    for (const result of guardResults) {
      if (result.succeeded === false) return result;
    }

    return { succeeded: true, failed: false };
  }

  public static againstNullOrUndefined(
    argument: any,
    argumentName: string,
  ): IGuardResult {
    if (argument === null || argument === undefined) {
      return {
        succeeded: false,
        failed: true,
        message: `${argumentName} is null or undefined`,
      };
    } else {
      return { succeeded: true, failed: false };
    }
  }

  public static againstNullOrUndefinedBulk(
    args: GuardArgumentCollection,
  ): IGuardResult {
    for (const arg of args) {
      const result = this.againstNullOrUndefined(
        arg.argument,
        arg.argumentName,
      );

      if (!result.succeeded) return result;
    }

    return { succeeded: true, failed: true };
  }

  public static isOneOf(
    value: any,
    validValues: any[],
    argumentName: string,
  ): IGuardResult {
    let isValid = false;
    for (const validValue of validValues) {
      if (value === validValue) {
        isValid = true;
      }
    }

    if (isValid) {
      return { succeeded: true, failed: false };
    } else {
      return {
        succeeded: false,
        failed: true,
        message: `${argumentName} isn't oneOf the correct types in ${JSON.stringify(
          validValues,
        )}. Got "${value}".`,
      };
    }
  }

  public static inRange(
    num: number,
    min: number,
    max: number,
    argumentName: string,
  ): IGuardResult {
    const isInRange = num >= min && num <= max;

    if (!isInRange) {
      return {
        succeeded: false,
        failed: true,
        message: `${argumentName} is not within range ${min} to ${max}.`,
      };
    } else {
      return { succeeded: true, failed: false };
    }
  }

  public static allInRange(
    numbers: number[],
    min: number,
    max: number,
    argumentName: string,
  ): IGuardResult {
    let failingResult: IGuardResult | null = null;
    for (const num of numbers) {
      const numIsInRangeResult = this.inRange(num, min, max, argumentName);

      if (!numIsInRangeResult.succeeded) failingResult = numIsInRangeResult;
    }

    if (failingResult) {
      return {
        succeeded: false,
        failed: true,
        message: `${argumentName} is not within the range.`,
      };
    } else {
      return { succeeded: true, failed: false };
    }
  }
}
