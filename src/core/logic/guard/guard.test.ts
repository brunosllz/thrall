import { Guard, GuardResult } from '.';

describe('Guard', () => {
  describe('combine', () => {
    it('should return the first failed result if any', () => {
      const results: GuardResult[] = [
        { isSucceeded: true, isFailed: false },
        { isSucceeded: false, isFailed: true, message: 'Failed' },
        { isSucceeded: true, isFailed: false },
      ];
      const result = Guard.combine(results);

      expect(result.isFailed).toBeTruthy();
      expect(result.message).toBe('Failed');
    });

    it('should return a succeeded result if all results succeeded', () => {
      const results = [
        { isSucceeded: true, isFailed: false },
        { isSucceeded: true, isFailed: false },
      ];
      const result = Guard.combine(results);

      expect(result.isSucceeded).toBeTruthy();
    });
  });

  describe('againstNullOrUndefined', () => {
    it('should fail for null value', () => {
      const result = Guard.againstNullOrUndefined(null, 'test');

      expect(result.isFailed).toBeTruthy();
    });

    it('should fail for undefined value', () => {
      const result = Guard.againstNullOrUndefined(undefined, 'test');

      expect(result.isFailed).toBeTruthy();
    });

    it('should succeed for non-null and non-undefined value', () => {
      const result = Guard.againstNullOrUndefined('value', 'test');

      expect(result.isSucceeded).toBeTruthy();
    });
  });

  describe('againstNullOrUndefinedBulk', () => {
    it('should fail if any argument is null or undefined', () => {
      const args = [
        { argument: 'value', argumentName: 'test1' },
        { argument: null, argumentName: 'test2' },
      ];
      const result = Guard.againstNullOrUndefinedBulk(args);

      expect(result.isFailed).toBeTruthy();
    });

    it('should succeed if no arguments are null or undefined', () => {
      const args = [
        { argument: 'value1', argumentName: 'test1' },
        { argument: 'value2', argumentName: 'test2' },
      ];
      const result = Guard.againstNullOrUndefinedBulk(args);

      expect(result.isSucceeded).toBeTruthy();
    });
  });

  describe('isOneOf', () => {
    it('should succeed if value is one of the valid values', () => {
      const result = Guard.isOneOf('value', ['value', 'another'], 'test');

      expect(result.isSucceeded).toBeTruthy();
    });

    it('should fail if value is not one of the valid values', () => {
      const result = Guard.isOneOf('value', ['different', 'another'], 'test');

      expect(result.isFailed).toBeTruthy();
    });
  });

  describe('inRange', () => {
    it('should succeed if number is within range', () => {
      const result = Guard.inRange(5, 1, 10, 'test');

      expect(result.isSucceeded).toBeTruthy();
    });

    it('should fail if number is below range', () => {
      const result = Guard.inRange(0, 1, 10, 'test');

      expect(result.isFailed).toBeTruthy();
    });

    it('should fail if number is above range', () => {
      const result = Guard.inRange(11, 1, 10, 'test');

      expect(result.isFailed).toBeTruthy();
    });
  });

  describe('allInRange', () => {
    it('should succeed if all numbers are within range', () => {
      const result = Guard.allInRange([2, 3, 4], 1, 10, 'test');

      expect(result.isSucceeded).toBeTruthy();
    });

    it('should fail if any number is not within range', () => {
      const result = Guard.allInRange([0, 5, 11], 1, 10, 'test');

      expect(result.isFailed).toBeTruthy();
    });
  });
});
