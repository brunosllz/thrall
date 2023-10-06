import { Interested } from '@/modules/project-management/domain/entities/interested';
import { ProjectInterestedList } from '@/modules/project-management/domain/entities/watched-lists/project-interested-list';
import {
  Member,
  MemberStatus,
  PermissionType,
} from '@modules/project-management/domain/entities/member';
import {
  Project,
  ProjectStatus,
} from '@modules/project-management/domain/entities/project';
import { Role } from '@modules/project-management/domain/entities/role';
import { Technology } from '@modules/project-management/domain/entities/technology';
import { Content } from '@modules/project-management/domain/entities/value-objects/content';
import {
  Meeting,
  MeetingType,
} from '@modules/project-management/domain/entities/value-objects/meeting';
import { Slug } from '@modules/project-management/domain/entities/value-objects/slug';
import { ProjectRoleList } from '@modules/project-management/domain/entities/watched-lists/project-role-list';
import { ProjectTechnologyList } from '@modules/project-management/domain/entities/watched-lists/project-technology-list';
import { TeamMembersList } from '@modules/project-management/domain/entities/watched-lists/team-members-list';
import {
  Answer as RawAnswer,
  Project as RawProject,
  Role as RawRole,
  Technology as RawTechnology,
  TeamMember as RawTeamMember,
  InterestedInProject as RawInterestedInProject,
  MEETING_TYPE,
} from '@prisma/client';

type ToDomainRawProps = RawProject & {
  projectRoles: Array<{ membersAmount: number; role: RawRole }>;
  technologies: RawTechnology[];
  answers: RawAnswer[];
  teamMembers: RawTeamMember[];
  interestedInProject: RawInterestedInProject[];
};

export class ProjectMapper {
  static toDomain(raw: ToDomainRawProps): Project {
    const roles = raw.projectRoles.map((projectRole) => {
      return Role.create(
        {
          projectId: raw.id,
          membersAmount: projectRole.membersAmount,
          name: Slug.createFromText(projectRole.role.name).getValue(),
        },
        projectRole.role.id,
      ).getValue();
    });

    const technologies = raw.technologies.map((technology) => {
      return Technology.create(technology.slug, technology.id).getValue();
    });

    const teamMembers = raw.teamMembers.map((teamMember) => {
      return Member.create(
        {
          recipientId: teamMember.recipientId,
          createdAt: teamMember.createdAt,
          permissionType: teamMember.permissionType as PermissionType,
          status: teamMember.status as MemberStatus,
          updatedAt: teamMember.updatedAt ?? undefined,
        },
        teamMember.id,
      ).getValue();
    });

    const interested = raw.interestedInProject.map((interested) => {
      return Interested.create(
        {
          recipientId: interested.userId,
          occurredAt: interested.occurredAt,
        },
        interested.id,
      ).getValue();
    });

    const project = Project.create(
      {
        authorId: raw.authorId,
        description: new Content(raw.description),
        name: raw.name,
        imageUrl: raw.imageUrl,
        status: raw.status as ProjectStatus,
        requirements: new Content(raw.requirements),
        meeting: Meeting.create({
          occurredTime: raw.meetingOccurredTime,
          type: raw.meetingType as MeetingType,
          date: raw.meetingDate as any,
        }).getValue(),
        roles: new ProjectRoleList(roles),
        technologies: new ProjectTechnologyList(technologies),
        teamMembers: new TeamMembersList(teamMembers),
        interested: new ProjectInterestedList(interested),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      raw.id,
    ).getValue();

    return project;
  }

  static toPersistence(project: Project) {
    return {
      rawProject: {
        id: project.id,
        authorId: project.authorId,
        name: project.name,
        description: project.description.value,
        imageUrl: project.imageUrl,
        status: project.status,
        slug: project.slug.value,
        meetingType: project.meeting.value.type as MEETING_TYPE,
        meetingDate: project.meeting.value.date,
        meetingOccurredTime: project.meeting.value.occurredTime,
        requirements: project.requirements.value,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
      rawTeamMembers: project.teamMembers,
      rawRoles: project.roles,
      rawTechnologies: project.technologies,
      rawInterested: project.interested,
    };
  }
}
