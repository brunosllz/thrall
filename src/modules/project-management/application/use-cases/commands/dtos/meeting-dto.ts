import {
  MeetingType,
  WEEK_DAYS,
} from '@modules/project-management/domain/entities/value-objects/meeting';

export interface MeetingDTO {
  occurredTime: string;
  type: MeetingType;
  date?: WEEK_DAYS | string;
}
