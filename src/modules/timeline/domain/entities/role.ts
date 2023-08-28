import { Entity } from '@common/domain/entities/entity';
import { Guard } from '@common/logic/Guard';
import { Result } from '@common/logic/result';
import { Optional } from '@common/logic/types/Optional';

import { Slug } from './value-objects/slug';

export interface RoleProps {
  name: Slug;
  membersAmount: number;
  assigneesId: string[];
  projectId: string;
}

export class Role extends Entity<RoleProps> {
  get name() {
    return this.props.name;
  }

  get membersAmount() {
    return this.props.membersAmount;
  }

  get assigneesId() {
    return this.props.assigneesId;
  }

  get projectId() {
    return this.props.projectId;
  }

  static create(props: Optional<RoleProps, 'assigneesId'>, id?: string) {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: 'name' },
      { argument: props.membersAmount, argumentName: 'membersAmount' },
      { argument: props.projectId, argumentName: 'projectId' },
    ]);

    if (guardResult.failed) {
      return Result.fail<Role>(guardResult.message);
    }

    const role = new Role(
      {
        ...props,
        assigneesId: props.assigneesId ?? [],
      },
      id,
    );

    return Result.ok<Role>(role);
  }
}
