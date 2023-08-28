import { Result } from './result';

class ExampleClass {
  private value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value: any): Result<ExampleClass> {
    if (!value) {
      return Result.fail('Value is required');
    }

    return Result.ok(new ExampleClass(value));
  }
}

describe('Result', () => {
  it('should be successfully', () => {
    const example = ExampleClass.create('example');

    expect(example.isSuccess).toBeTruthy();
    expect(example.getValue()).toMatchObject({ value: 'example' });
  });

  it('should be fail if not provide value', () => {
    const example = ExampleClass.create(null);

    expect(example.isFailure).toBeTruthy();
    expect(example.error).toEqual('Value is required');
  });
});
