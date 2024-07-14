export abstract class ValueObject<T> {
  protected value: T;

  protected constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }
}
