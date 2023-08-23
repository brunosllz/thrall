//TODO: maybe will need put project id here, when persist in database

export enum TimeIdentifier {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}

interface RequirementProps {
  timeAmount: number;
  timeIdentifier: TimeIdentifier;
  content?: string;
}

export class Requirement {
  readonly value: RequirementProps;

  private constructor(props: RequirementProps) {
    this.value = props;
  }

  static create(props: RequirementProps) {
    const requirement = new Requirement(props);

    return requirement;
  }
}
