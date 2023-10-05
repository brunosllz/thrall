import { AggregateRoot } from '@common/domain/entities/aggregate-root';
import { Guard } from '@common/logic/Guard';
import { Result } from '@common/logic/result';
import { Optional } from '@common/logic/types/Optional';

import { ExpressProjectInterestEvent } from '../events/express-project-interest';
import { RejectedInviteTeamMemberEvent } from '../events/rejected-invite-team-member';
import { SendInviteTeamMemberEvent } from '../events/send-invite-team-member';
import { Interested } from './interested';
import { Member, MemberStatus, PermissionType } from './member';
import { Content } from './value-objects/content';
import { Meeting } from './value-objects/meeting';
import { Slug } from './value-objects/slug';
import { ProjectInterestedList } from './watched-lists/project-interested-list';
import { ProjectRoleList } from './watched-lists/project-role-list';
import { ProjectTechnologyList } from './watched-lists/project-technology-list';
import { TeamMembersList } from './watched-lists/team-members-list';

export enum ProjectStatus {
  DRAFT = 'draft',
  RECRUITING = 'recruiting',
  CLOSED = 'closed',
}

export interface ProjectProps {
  authorId: string;
  name: string;
  description: Content;
  slug: Slug;
  imageUrl: string;
  status: ProjectStatus;
  roles: ProjectRoleList;
  technologies: ProjectTechnologyList;
  requirements: Content;
  meeting: Meeting;
  interested: ProjectInterestedList;
  teamMembers: TeamMembersList;
  createdAt: Date;
  updatedAt?: Date;
}

export class Project extends AggregateRoot<ProjectProps> {
  get authorId() {
    return this.props.authorId;
  }

  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  get slug() {
    return this.props.slug;
  }

  get imageUrl() {
    return this.props.imageUrl;
  }

  get status() {
    return this.props.status;
  }

  get roles() {
    return this.props.roles;
  }

  get technologies() {
    return this.props.technologies;
  }

  get requirements() {
    return this.props.requirements;
  }

  get meeting() {
    return this.props.meeting;
  }

  get interested() {
    return this.props.interested;
  }

  get teamMembers() {
    return this.props.teamMembers;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set name(text: string) {
    this.props.name = text;
    this.props.slug = Slug.createFromText(text).getValue();
    this.touch();
  }

  set description(description: Content) {
    this.props.description = description;
    this.touch();
  }

  set roles(roles: ProjectRoleList) {
    this.props.roles = roles;
    this.touch();
  }

  set technologies(technologies: ProjectTechnologyList) {
    this.props.technologies = technologies;
    this.touch();
  }

  set requirements(requirements: Content) {
    this.props.requirements = requirements;
    this.touch();
  }

  set teamMembers(teamMembers: TeamMembersList) {
    this.props.teamMembers = teamMembers;
    this.touch();
  }

  sendInviteTeamMember(recipientId: string, senderId: string) {
    const alreadyAdded = this.teamMembers
      .getItems()
      .find((member) => member.recipientId === recipientId);

    const inviteIsPending = alreadyAdded?.status === MemberStatus.PENDING;

    if (alreadyAdded && inviteIsPending) {
      return Result.fail<Project>('Invite is pending');
    }

    const memberOrError = Member.create({
      recipientId,
      status: MemberStatus.PENDING,
    });

    if (memberOrError.isFailure) {
      return Result.fail<Project>(memberOrError.error);
    }

    const newMember = memberOrError.getValue();

    this.teamMembers.add(newMember);

    this.addDomainEvent(
      new SendInviteTeamMemberEvent({
        project: this,
        recipientId: recipientId,
        senderId,
      }),
    );
  }

  addInterested(recipientId: string) {
    const alreadyExists = this.interested.getItems().find((interested) => {
      interested.recipientId === recipientId;
    });

    if (alreadyExists) {
      return Result.fail<Project>('It is already interested');
    }

    const interestedOrError = Interested.create({
      recipientId,
    });

    if (interestedOrError.isFailure) {
      return Result.fail<Project>(interestedOrError.error);
    }

    const interested = interestedOrError.getValue();

    this.interested.add(interested);

    this.addDomainEvent(
      new ExpressProjectInterestEvent({
        project: this,
        recipientId: recipientId,
      }),
    );
  }

  acceptInviteTeamMember(memberId: string) {
    const teamMembers = this.teamMembers.getItems();

    const member = teamMembers.find(
      (member) => member.recipientId === memberId,
    );

    if (member) {
      member.changeStatus(MemberStatus.APPROVED);
      this.teamMembers.update(teamMembers);
    }
  }

  rejectInviteTeamMember(memberId: string) {
    const teamMembers = this.teamMembers.getItems();

    const member = teamMembers.find(
      (member) => member.recipientId === memberId,
    );

    if (member) {
      member.changeStatus(MemberStatus.REJECTED);
      this.teamMembers.update(teamMembers);
    }

    this.addDomainEvent(
      new RejectedInviteTeamMemberEvent({ memberId, projectId: this.id }),
    );
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<
      Omit<ProjectProps, 'slug'>,
      'createdAt' | 'roles' | 'technologies' | 'teamMembers' | 'interested'
    >,
    id?: string,
  ) {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.authorId, argumentName: 'authorId' },
      { argument: props.description, argumentName: 'description' },
      { argument: props.name, argumentName: 'name' },
    ]);

    if (guardResult.failed) {
      return Result.fail<Project>(guardResult.message);
    }

    const slugOrError = Slug.createFromText(props.name);

    if (slugOrError.isFailure) {
      return Result.fail<Project>(slugOrError.error);
    }

    const slug = slugOrError.getValue();

    const MemberOrError = Member.create({
      recipientId: props.authorId,
      permissionType: PermissionType.OWNER,
      status: MemberStatus.APPROVED,
    });

    if (MemberOrError.isFailure) {
      return Result.fail<Project>(MemberOrError.error);
    }

    const ProjectOwner = MemberOrError.getValue();

    const project = new Project(
      {
        ...props,
        slug: slug,
        roles: props.roles ?? new ProjectRoleList(),
        technologies: props.technologies ?? new ProjectTechnologyList(),
        interested: props.interested ?? new ProjectInterestedList(),
        teamMembers: props.teamMembers ?? new TeamMembersList([ProjectOwner]),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return Result.ok<Project>(project);
  }
}
