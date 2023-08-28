import { Member, MemberStatus } from '@modules/timeline/domain/entities/member';
import { Project } from '@modules/timeline/domain/entities/project';
import { Role } from '@modules/timeline/domain/entities/role';
import { Technology } from '@modules/timeline/domain/entities/technology';
import {
  Requirement,
  TimeIdentifier,
} from '@modules/timeline/domain/entities/value-objects/requirement';
import { Slug } from '@modules/timeline/domain/entities/value-objects/slug';
import { ProjectRoleList } from '@modules/timeline/domain/entities/watched-list/project-role-list';
import { ProjectTechnologyList } from '@modules/timeline/domain/entities/watched-list/project-technology-list';
import { TeamMembersList } from '@modules/timeline/domain/entities/watched-list/team-members-list';
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
          amount: projectRole.membersAmount,
          name: Slug.createFromText(projectRole.role.name),
        },
        projectRole.role.id,
      );
    });

    const technologies = raw.technologies.map((technology) => {
      return Technology.create(technology.slug, technology.id);
    });

    const teamMembers = raw.teamMembers.map((teamMember) => {
      return Member.create(
        {
          recipientId: teamMember.recipientId,
          createdAt: teamMember.createdAt,
          permissionType: teamMember.permissionType,
          status: teamMember.status as MemberStatus,
          updatedAt: teamMember.updatedAt,
        },
        teamMember.id,
      );
    });

    const project = Project.create(
      {
        authorId: raw.authorId,
        content: raw.content,
        title: raw.title,
        requirements: Requirement.create({
          content: raw.requirementContent ?? undefined,
          timeAmount: raw.requirementPeriodAmount,
          timeIdentifier: raw.requirementPeriodIdentifier as TimeIdentifier,
        }),
        roles: new ProjectRoleList(roles),
        technologies: new ProjectTechnologyList(technologies),
        teamMembers: new TeamMembersList(teamMembers),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      raw.id,
    );

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
        requirementContent: project.requirements.value.content ?? null,
        requirementPeriodAmount: project.requirements.value.timeAmount,
        requirementPeriodIdentifier: project.requirements.value.timeIdentifier,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
      rawTeamMembers: project.teamMembers,
      rawRoles: project.roles,
      rawTechnologies: project.technologies,
    };
  }
}
