import { Guard } from '@common/logic/Guard';
import { Result } from '@common/logic/result';

export enum MeetingType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export enum WEEK_DAYS {
  SUNDAY = 'sunday',
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
}

interface MeetingProps {
  type: MeetingType;
  date?: WEEK_DAYS | string;
  occurredTime: string;
}

export class Meeting {
  readonly value: MeetingProps;

  private constructor(props: MeetingProps) {
    this.value = props;
  }

  private validateFormatTime(value: string) {
    const validate = /^(0[6-9]|1[0-9]|2[0-3]):(00|30)$/;

    return validate.test(value);
  }

  private validateDate(value: WEEK_DAYS | string) {
    const isValidWeekDay = Object.values(WEEK_DAYS).includes(
      value as WEEK_DAYS,
    );

    if (isValidWeekDay) {
      return true;
    }

    const valueNumber = Number(value);

    if (valueNumber >= 1 && valueNumber <= 31) {
      return true;
    } else {
      return false;
    }
  }

  private validateMeetingFormatByType(props: MeetingProps) {
    if (props.type === MeetingType.DAILY) {
      if (!props.occurredTime) {
        return Result.fail<Meeting>('Daily meeting must have an occurred time');
      }
    }

    if (props.type === MeetingType.WEEKLY) {
      if (!props.occurredTime) {
        return Result.fail<Meeting>(
          'Weekly meeting must have an occurred time',
        );
      }

      if (!props.date) {
        return Result.fail<Meeting>('Weekly meeting must have a week day');
      }

      const isValidWeekDayProps = Object.values(WEEK_DAYS).includes(
        props.date as WEEK_DAYS,
      );

      if (!isValidWeekDayProps) {
        return Result.fail<Meeting>('Weekly meeting must have a week day');
      }
    }

    if (props.type === MeetingType.MONTHLY) {
      if (!props.occurredTime) {
        return Result.fail<Meeting>(
          'Monthly meeting must have an occurred time',
        );
      }

      if (!props.date) {
        return Result.fail<Meeting>('Monthly meeting must have a date');
      }

      const isValidDateProps = this.validateDate(props.date);

      if (!isValidDateProps) {
        return Result.fail<Meeting>('Monthly meeting must have a valid date');
      }
    }

    return Result.ok<Meeting>(new Meeting(props));
  }

  static create(props: MeetingProps) {
    const guardResult = Guard.againstNullOrUndefined(props.type, 'type');

    if (guardResult.failed) {
      return Result.fail<Meeting>(guardResult.message);
    }

    const meeting = new Meeting(props);

    const isValidPeriodTime = meeting.validateFormatTime(props.occurredTime);

    if (!isValidPeriodTime) {
      return Result.fail<Meeting>('Invalid occurred time format');
    }

    if (props.date) {
      const isValidPeriodDate = meeting.validateDate(props.date);

      if (!isValidPeriodDate) {
        return Result.fail<Meeting>('Invalid date');
      }
    }

    return meeting.validateMeetingFormatByType(props);
  }
}
