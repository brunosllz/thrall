import { Entity } from '@/core/domain/entities/entity';
import { Slug } from '@/core/domain/value-objects/slug';
import { Guard } from '@/core/logic/Guard';
import { Result } from '@/core/logic/result';
import { Optional } from '@/core/logic/types/Optional';

import { Content } from './value-objects/content';
import { MembersIdsAssignedList } from './watched-lists/members-ids-assigned-list';

export interface JobProps {
  name: string;
  slug: Slug;
  jobAmountAvailable: number;
  description: Content;
  membersIdsAssigned: MembersIdsAssignedList;
  projectId: string;
}

export class Job extends Entity<JobProps> {
  assignMember(memberId: string) {
    const membersIdsAssigned = this.props.membersIdsAssigned.getItems();

    const hasLimitToAssign =
      membersIdsAssigned.length >= this.props.jobAmountAvailable;

    if (hasLimitToAssign) {
      return Result.fail<Job>('This job has no more available slots');
    }

    const isMemberAssigned = membersIdsAssigned.includes(memberId);

    if (isMemberAssigned) {
      return Result.fail<Job>('Member already assigned to this job');
    }

    this.props.membersIdsAssigned.add(memberId);
  }

  static create(
    props: Optional<JobProps, 'membersIdsAssigned' | 'slug'>,
    id?: string,
  ) {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: 'name' },
      {
        argument: props.jobAmountAvailable,
        argumentName: 'jobAmountAvailable',
      },
      { argument: props.description, argumentName: 'description' },
      { argument: props.projectId, argumentName: 'projectId' },
    ]);

    if (guardResult.failed) {
      return Result.fail<Job>(guardResult.message);
    }

    const job = new Job(
      {
        ...props,
        slug: Slug.createFromText(props.name).getValue(),
        membersIdsAssigned:
          props.membersIdsAssigned ?? new MembersIdsAssignedList(),
      },
      id,
    );

    return Result.ok<Job>(job);
  }
}
