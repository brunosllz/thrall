import { Guard } from '@common/logic/Guard';
import { Result } from '@common/logic/result';

export enum PeriodIdentifier {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

interface RequirementProps {
  periodAmount: number;
  periodIdentifier: PeriodIdentifier;
  content?: string;
}

export class Requirement {
  readonly value: RequirementProps;

  private constructor(props: RequirementProps) {
    this.value = props;
  }

  static create(props: RequirementProps) {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.periodAmount, argumentName: 'periodAmount' },
      { argument: props.periodIdentifier, argumentName: 'periodIdentifier' },
    ]);

    if (guardResult.failed) {
      return Result.fail<Requirement>(guardResult.message);
    }

    if (props.periodAmount <= 0) {
      return Result.fail<Requirement>('Period amount must be greater than 0');
    }

    if (props.periodAmount > 24 && PeriodIdentifier.DAY) {
      return Result.fail<Requirement>(
        'Exceeded maximum amount of hours per day',
      );
    }

    const requirement = new Requirement(props);

    return Result.ok<Requirement>(requirement);
  }
}
