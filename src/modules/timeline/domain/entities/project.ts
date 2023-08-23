import { AggregateRoot } from '@common/domain/entities/aggregate-root';
import { Optional } from '@common/logic/types/Optional';

import { ExpressProjectInterestEvent } from '../events/express-project-interest';
import { SendInviteTeamMemberEvent } from '../events/send-invite-team-member';
import { Member, MemberStatus } from './member';
import { Interested } from './value-objects/interested';
import { Requirement } from './value-objects/requirement';
import { Slug } from './value-objects/slug';
import { ProjectInterestedList } from './watched-list/project-interested-list';
import { ProjectRoleList } from './watched-list/project-role-list';
import { ProjectTechnologyList } from './watched-list/project-technology-list';
import { TeamMembersList } from './watched-list/team-members-list';

export interface ProjectProps {
  authorId: string;
  title: string;
  content: string;
  slug: Slug;
  roles: ProjectRoleList;
  technologies: ProjectTechnologyList;
  requirements: Requirement;
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

  get requirements() {
    return this.props.requirements;
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
    this.props.slug = Slug.createFromText(text);
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

  set requirements(requirements: Requirement) {
    this.props.requirements = requirements;
    this.touch();
  }

  set teamMembers(teamMembers: TeamMembersList) {
    this.props.teamMembers = teamMembers;
    this.touch();
  }

  sendInviteTeamMember(recipientId: string, senderId: string) {
    const invitedMember = Member.create({
      recipientId,
      status: MemberStatus.PENDING,
    });

    this.teamMembers.add(invitedMember);

    this.addDomainEvent(
      new SendInviteTeamMemberEvent({
        project: this,
        recipientId: recipientId,
        senderId,
      }),
    );
  }

  addInterested(recipientId: string) {
    const interested = Interested.create({
      recipientId,
    });

    this.interested.add(interested);

    this.addDomainEvent(
      new ExpressProjectInterestEvent({
        project: this,
        recipientId: recipientId,
      }),
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
    const project = new Project(
      {
        ...props,
        slug: Slug.createFromText(props.title),
        roles: props.roles ?? new ProjectRoleList(),
        technologies: props.technologies ?? new ProjectTechnologyList(),
        interested: props.interested ?? new ProjectInterestedList(),
        teamMembers:
          props.teamMembers ??
          new TeamMembersList([
            Member.create({
              recipientId: props.authorId,
              permissionType: 'owner',
              status: MemberStatus.APPROVED,
            }),
          ]),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return project;
  }
}
