import {
  AvailableToParticipate,
  UnitTimeType,
} from './available-to-participate';

describe('Available to participate', () => {
  it('should be able to create a instance of available to participate', () => {
    const availableToParticipate = AvailableToParticipate.create({
      value: {
        availableDays: [1, 3, 5],
        availableTime: {
          value: 2,
          unit: UnitTimeType.HOUR,
        },
      },
    });

    expect(availableToParticipate.isSuccess).toBeTruthy();
    expect(availableToParticipate.getValue().value.availableDays).toHaveLength(
      3,
    );
  });

  it('should be not able to create a instance of available to participate with invalid day', () => {
    const availableToParticipate = AvailableToParticipate.create({
      value: {
        availableDays: [1, 3, 5, 8],
        availableTime: {
          value: 2,
          unit: UnitTimeType.HOUR,
        },
      },
    });

    expect(availableToParticipate.isFailure).toBeTruthy();
    expect(availableToParticipate.error).toBe(
      'Invalid param day, must be between 0 and 6',
    );
  });
});
