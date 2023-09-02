import { AggregateRoot } from '@common/domain/entities/aggregate-root';
import { Guard } from '@common/logic/Guard';
import { Result } from '@common/logic/result';
import { Optional } from '@common/logic/types/Optional';

import { ExpressProjectInterestEvent } from '../events/express-project-interest';
import { RejectedInviteTeamMemberEvent } from '../events/rejected-invite-team-member';
import { SendInviteTeamMemberEvent } from '../events/send-invite-team-member';
import { Interested } from './interested';
import { Member, MemberStatus, PermissionType } from './member';
import { Requirement } from './value-objects/requirement';
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
  description: string;
  slug: Slug;
  imageUrl: string;
  status: ProjectStatus;
  roles: ProjectRoleList;
  technologies: ProjectTechnologyList;
  requirement: Requirement;
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

  get excerpt() {
    if (this.description.length >= 150) {
      return this.props.description.substring(0, 147).trimEnd().concat('...');
    }

    return this.description;
  }

  get slug() {
    return this.props.slug;
  }

  get roles() {
    return this.props.roles;
  }

  get technologies() {
    return this.props.technologies;
  }

  get requirement() {
    return this.props.requirement;
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

  set description(description: string) {
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

  set requirement(requirement: Requirement) {
    this.props.requirement = requirement;
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
      member.status = MemberStatus.APPROVED;
    }
  }

  rejectInviteTeamMember(memberId: string) {
    const teamMembers = this.teamMembers.getItems();

    const member = teamMembers.find(
      (member) => member.recipientId === memberId,
    );

    if (member) {
      member.status = MemberStatus.REJECTED;
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
