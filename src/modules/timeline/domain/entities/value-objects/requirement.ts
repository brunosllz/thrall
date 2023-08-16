//TODO: maybe will need put project id here, when persist in database

interface RequirementProps {
  timeAmount: number;
  timeIdentifier: 'day' | 'week' | 'month';
  content: string;
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
