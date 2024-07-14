import { monotonicFactory } from 'ulid';

export class UniqueID {
  private value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(prefixId: string) {
    return new UniqueID(`${prefixId}_${monotonicFactory()}`);
  }

  restore(value: string) {
    this.value = value;
  }

  toString() {
    return this.value;
  }

  equals(id: UniqueID) {
    return id.toString() === this.value;
  }
}
