export class Summary {
  constructor(private value: string) {}

  get content() {
    return this.value;
  }

  static summarize(value: string) {
    if (value.length >= 500) {
      return value.slice(0, 500).concat('...');
    }

    return value;
  }

  static create(value: string) {
    const summary = this.summarize(value);

    return new Summary(summary);
  }
}
