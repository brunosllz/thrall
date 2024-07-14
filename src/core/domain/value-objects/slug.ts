import { Guard } from '@/core/logic/guard';
import { Result } from '@/core/logic/result';

import { ValueObject } from './value-object';

export class Slug extends ValueObject<string> {
  /**
   * Receives a string and normalize it as a slug.
   *
   * Example: "An example title" => "an-example-title"
   *
   * @param text {string}
   */
  static createFromText(text: string): Result<Slug> {
    const guardResult = Guard.againstNullOrUndefined(text, 'text');

    if (guardResult.isFailed) {
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
