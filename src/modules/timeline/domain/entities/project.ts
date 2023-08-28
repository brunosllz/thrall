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

export interface ProjectProps {
  authorId: string;
  title: string;
  content: string;
  slug: Slug;
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

  get title() {
    return this.props.title;
  }

  get content() {
    return this.props.content;
  }

  get excerpt() {
    if (this.content.length >= 120) {
      return this.props.content.substring(0, 120).trimEnd().concat('...');
    }

    return this.content;
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

  set title(text: string) {
    this.props.title = text;
    this.props.slug = Slug.createFromText(text).getValue();
    this.touch();
  }

  set content(content: string) {
    this.props.content = content;
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
      { argument: props.content, argumentName: 'content' },
      { argument: props.title, argumentName: 'title' },
    ]);

    if (guardResult.failed) {
      return Result.fail<Project>(guardResult.message);
    }

    const slugOrError = Slug.createFromText(props.title);

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
