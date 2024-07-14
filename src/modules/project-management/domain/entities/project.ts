import { AggregateRoot } from '@/core/domain/entities/aggregate-root';
import { Slug } from '@/core/domain/value-objects/slug';
import { Guard } from '@/core/logic/guard';
import { Result } from '@/core/logic/result';
import { Optional } from '@/core/logic/types/Optional';

import { ExpressProjectInterestEvent } from '../events/express-project-interest';
import { RejectedInviteTeamMemberEvent } from '../events/rejected-invite-team-member';
import { SendInviteTeamMemberEvent } from '../events/send-invite-team-member';
import { Interested } from './interested';
import { Member, MemberStatus, PermissionType } from './member';
import { AvailableToParticipate } from './value-objects/available-to-participate';
import { Content } from './value-objects/content';
// import { Meeting } from './value-objects/meeting';
import { ProjectGeneralSkillList } from './watched-lists/project-general-skill-list';
import { ProjectInterestedList } from './watched-lists/project-interested-list';
import { ProjectJobList } from './watched-lists/project-job-list';
import { TeamMembersList } from './watched-lists/team-members-list';
export enum ProjectStatus {
  RECRUITING = 'recruiting',
  CLOSED = 'closed',
}

export interface ProjectProps {
  authorId: string;
  name: string;
  description: Content;
  slug: Slug;
  imageUrl?: string;
  bannerUrl?: string;
  status: ProjectStatus;
  jobs: ProjectJobList;
  generalSkills: ProjectGeneralSkillList;
  availableToParticipate: AvailableToParticipate;
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

  get bannerUrl() {
    return this.props.bannerUrl;
  }

  get status() {
    return this.props.status;
  }

  get jobs() {
    return this.props.jobs;
  }

  get generalSkills() {
    return this.props.generalSkills;
  }

  get availableToParticipate() {
    return this.props.availableToParticipate;
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

  set imageUrl(imageUrl: string | undefined) {
    this.props.imageUrl = imageUrl;
    this.touch();
  }

  set bannerUrl(bannerUrl: string | undefined) {
    this.props.bannerUrl = bannerUrl;
    this.touch();
  }

  set jobs(jobs: ProjectJobList) {
    this.props.jobs = jobs;
    this.touch();
  }

  set generalSkills(generalSkills: ProjectGeneralSkillList) {
    this.props.generalSkills = generalSkills;
    this.touch();
  }

  set availableToParticipate(availableToParticipate: AvailableToParticipate) {
    this.props.availableToParticipate = availableToParticipate;
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
      return Result.fail<Member>(memberOrError.error);
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
    const alreadyExists = this.interested
      .getItems()
      .find((interested) => interested.recipientId === recipientId);

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
      | 'createdAt'
      | 'jobs'
      | 'generalSkills'
      | 'teamMembers'
      | 'interested'
      | 'status'
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
        status: ProjectStatus.RECRUITING,
        jobs: props.jobs ?? new ProjectJobList(),
        generalSkills: props.generalSkills ?? new ProjectGeneralSkillList(),
        interested: props.interested ?? new ProjectInterestedList(),
        teamMembers: props.teamMembers ?? new TeamMembersList([ProjectOwner]),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return Result.ok<Project>(project);
  }
}
