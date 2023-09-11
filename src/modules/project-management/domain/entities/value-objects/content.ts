export class Content {
  readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  static createExcerptFromText(text: string, limit: number) {
    return text.length > limit
      ? text.substring(0, limit).trimEnd().concat('...')
      : text;
  }
}
