import { Guard } from '@/common/logic/Guard';
import { Result } from '@/common/logic/result';

export enum UnitTimeType {
  HOUR = 'hour',
  MINUTE = 'minute',
}

interface AvailableToParticipateProps {
  availableDays: number[];
  availableTime: {
    value: number;
    unit: UnitTimeType;
  };
}

export class AvailableToParticipate {
  readonly value: AvailableToParticipateProps;

  private constructor(props: AvailableToParticipateProps) {
    this.value = props;
  }

  static create({
    value: { availableDays, availableTime },
  }: AvailableToParticipate) {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: availableDays, argumentName: 'availableDays' },
      { argument: availableTime, argumentName: 'availableTime' },
    ]);

    if (guardResult.failed) {
      return Result.fail<AvailableToParticipate>(guardResult.message);
    }

    const hasInvalidDay = availableDays.some((day) => day < 0 || day > 6);

    if (hasInvalidDay) {
      return Result.fail<AvailableToParticipate>(
        'Invalid param day, must be between 0 and 6',
      );
    }

    const availableToParticipate = new AvailableToParticipate({
      availableDays,
      availableTime,
    });

    return Result.ok<AvailableToParticipate>(availableToParticipate);
  }
}
