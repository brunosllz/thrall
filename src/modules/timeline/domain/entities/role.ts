import { Entity } from '@common/domain/entities/entity';
import { Optional } from '@common/logic/types/Optional';

import { Slug } from './value-objects/slug';

export interface RoleProps {
  name: Slug;
  amount: number;
  projectId: string;
  assigneesId: string[];
}

export class Role extends Entity<RoleProps> {
  get name() {
    return this.props.name;
  }

  get amount() {
    return this.props.amount;
  }

  get assigneesId() {
    return this.props.assigneesId;
  }

  get projectId() {
    return this.props.projectId;
  }

  static create(props: Optional<RoleProps, 'assigneesId'>, id?: string) {
    const projectRole = new Role(
      { ...props, assigneesId: props.assigneesId ?? [] },
      id,
    );

    return projectRole;
  }
}
