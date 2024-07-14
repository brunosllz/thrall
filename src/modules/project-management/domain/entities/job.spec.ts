import { Slug } from '@/core/domain/value-objects/slug';

import { Job } from './job';
import { Content } from './value-objects/content';
import { MembersIdsAssignedList } from './watched-lists/members-ids-assigned-list';

describe('Job', () => {
  it('should be able to create a job', () => {
    const job = Job.create({
      name: 'Front end',
      projectId: 'project-id',
      jobAmountAvailable: 3,
      description: new Content('Lorem ipsum dolor sit amet.'),
    });

    expect(job.getValue()).toMatchObject({
      name: 'Front end',
      slug: Slug.createFromText('Front end').getValue(),
      jobAmountAvailable: 3,
    });
  });

  it('should assign a member to the job', () => {
    const job = Job.create({
      name: 'Front end',
      projectId: 'project-id',
      jobAmountAvailable: 3,
      description: new Content('Lorem ipsum dolor sit amet.'),
    }).getValue();

    const memberId = 'member-id';

    job.assignMember(memberId);

    expect(job.membersIdsAssigned.getItems()).toContain(memberId);
  });

  it('should fail to assign a member if the member is already assigned', () => {
    const job = Job.create({
      name: 'Front end',
      projectId: 'project-id',
      jobAmountAvailable: 3,
      description: new Content('Lorem ipsum dolor sit amet.'),
      membersIdsAssigned: new MembersIdsAssignedList(['member-id']),
    }).getValue();

    const memberId = 'member-id';

    const result = job.assignMember(memberId);

    expect(result?.isFailure).toBe(true);
    expect(result?.error).toBe('Member already assigned to this job');
  });

  it('should fail to assign a member if there are no available slots', () => {
    const job = Job.create({
      name: 'Front end',
      projectId: 'project-id',
      jobAmountAvailable: 1,
      description: new Content('Lorem ipsum dolor sit amet.'),
      membersIdsAssigned: new MembersIdsAssignedList(['member-id']),
    }).getValue();

    const memberId = 'another-member-id';

    const result = job.assignMember(memberId);

    expect(result?.isFailure).toBe(true);
    expect(result?.error).toBe('This job has no more available slots');
  });
});
