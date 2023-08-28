import { Guard } from '@common/logic/Guard';
import { Result } from '@common/logic/result';

export class Slug {
  readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  /**
   * Receives a string and normalize it as a slug.
   *
   * Example: "An example title" => "an-example-title"
   *
   * @param text {string}
   */
  static createFromText(text: string): Result<Slug> {
    const guardResult = Guard.againstNullOrUndefined(text, 'text');

    if (guardResult.failed) {
      return Result.fail<Slug>(guardResult.message);
    }

    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '');

    return Result.ok<Slug>(new Slug(slugText));
  }
}
