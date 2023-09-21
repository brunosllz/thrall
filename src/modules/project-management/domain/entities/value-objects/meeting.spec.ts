import { Meeting, MeetingType, WEEK_DAYS } from './meeting';

describe('meeting', () => {
  it('should be able to create meeting of daily type', () => {
    const meeting = Meeting.create({
      type: MeetingType.DAILY,
      occurredTime: '12:00',
    });

    expect(meeting.isSuccess).toBeTruthy();
  });

  it('should be able to create meeting of weekly type', () => {
    const meeting = Meeting.create({
      type: MeetingType.WEEKLY,
      date: WEEK_DAYS.SATURDAY,
      occurredTime: '12:00',
    });

    expect(meeting.isSuccess).toBeTruthy();
  });

  it('should be not able create a meeting of weekly type with invalid occurred time', () => {
    const meeting = Meeting.create({
      type: MeetingType.WEEKLY,
      date: WEEK_DAYS.SATURDAY,
      occurredTime: '00:00',
    });

    expect(meeting.isFailure).toBeTruthy();
    expect(meeting.error).toBe('Invalid occurred time format');
  });

  it('should be not able create a meeting of weekly type without a week day', () => {
    const meeting = Meeting.create({
      type: MeetingType.WEEKLY,
      occurredTime: '13:00',
    });

    expect(meeting.isFailure).toBeTruthy();
    expect(meeting.error).toBe('Weekly meeting must have a week day');
  });

  it('should be not able create a meeting of weekly type with invalid week day', () => {
    const meeting = Meeting.create({
      type: MeetingType.WEEKLY,
      date: '8',
      occurredTime: '12:00',
    });

    expect(meeting.isFailure).toBeTruthy();
  });

  it('should be able to create of monthly type', () => {
    const meeting = Meeting.create({
      type: MeetingType.MONTHLY,
      date: '1',
      occurredTime: '12:00',
    });

    expect(meeting.isSuccess).toBeTruthy();
  });

  it('should be not able to create a meeting of monthly type with invalid occurred time', () => {
    const meeting = Meeting.create({
      type: MeetingType.MONTHLY,
      date: '1',
      occurredTime: '00:00',
    });

    expect(meeting.isFailure).toBeTruthy();
    expect(meeting.error).toBe('Invalid occurred time format');
  });

  it('should be not able to create a meeting of monthly type with invalid date', () => {
    const meeting = Meeting.create({
      type: MeetingType.MONTHLY,
      date: '32',
      occurredTime: '12:00',
    });

    expect(meeting.isFailure).toBeTruthy();
    expect(meeting.error).toBe('Invalid date');
  });

  it('should be not able to create a meeting of monthly type without a date', () => {
    const meeting = Meeting.create({
      type: MeetingType.MONTHLY,
      occurredTime: '12:00',
    });

    expect(meeting.isFailure).toBeTruthy();
    expect(meeting.error).toBe('Monthly meeting must have a date');
  });
});
