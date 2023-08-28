import {
  Member,
  MemberStatus,
  PermissionType,
} from '@modules/timeline/domain/entities/member';
import { Project } from '@modules/timeline/domain/entities/project';
import { Role } from '@modules/timeline/domain/entities/role';
import { Technology } from '@modules/timeline/domain/entities/technology';
import {
  PeriodIdentifier,
  Requirement,
} from '@modules/timeline/domain/entities/value-objects/requirement';
import { Slug } from '@modules/timeline/domain/entities/value-objects/slug';
import { ProjectRoleList } from '@modules/timeline/domain/entities/watched-lists/project-role-list';
import { ProjectTechnologyList } from '@modules/timeline/domain/entities/watched-lists/project-technology-list';
import { TeamMembersList } from '@modules/timeline/domain/entities/watched-lists/team-members-list';
import {
  Answer as RawAnswer,
  Project as RawProject,
  Role as RawRole,
  Technology as RawTechnology,
  TeamMember as RawTeamMember,
} from '@prisma/client';

type ToDomainRawProps = RawProject & {
  projectRoles: Array<{ membersAmount: number; role: RawRole }>;
  technologies: RawTechnology[];
  answers: RawAnswer[];
  teamMembers: RawTeamMember[];
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

    const project = Project.create(
      {
        authorId: raw.authorId,
        content: raw.content,
        title: raw.title,
        requirement: Requirement.create({
          content: raw.requirementContent ?? undefined,
          periodAmount: raw.requirementPeriodAmount,
          periodIdentifier: raw.requirementPeriodIdentifier as PeriodIdentifier,
        }).getValue(),
        roles: new ProjectRoleList(roles),
        technologies: new ProjectTechnologyList(technologies),
        teamMembers: new TeamMembersList(teamMembers),
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
        content: project.content,
        title: project.title,
        slug: project.slug.value,
        requirementContent: project.requirement.value.content ?? null,
        requirementPeriodAmount: project.requirement.value.periodAmount,
        requirementPeriodIdentifier: project.requirement.value.periodIdentifier,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
      rawTeamMembers: project.teamMembers,
      rawRoles: project.roles,
      rawTechnologies: project.technologies,
    };
  }
}
