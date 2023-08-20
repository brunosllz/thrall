import { Member } from '@modules/timeline/domain/entities/member';
import { Project } from '@modules/timeline/domain/entities/project';
import { ProjectRoleList } from '@modules/timeline/domain/entities/project-role-list';
import { ProjectTechnologyList } from '@modules/timeline/domain/entities/project-technology-list';
import { Role } from '@modules/timeline/domain/entities/role';
import { TeamMembersList } from '@modules/timeline/domain/entities/team-members-list';
import { Technology } from '@modules/timeline/domain/entities/technology';
import { Requirement } from '@modules/timeline/domain/entities/value-objects/requirement';
import { Slug } from '@modules/timeline/domain/entities/value-objects/slug';
import {
  Answer as RawAnswer,
  Project as RawProject,
  Role as RawRole,
  Technology as RawTechnology,
  TeamMember as RawTeamMember,
} from '@prisma/client';

type ToDomainRawProps = RawProject & {
  projectRole: Array<{ amount: number; role: RawRole }>;
  technology: RawTechnology[];
  answer: RawAnswer[];
  teamMember: RawTeamMember[];
};

export class ProjectMapper {
  static toDomain(raw: ToDomainRawProps): Project {
    const roles = raw.projectRole.map((projectRole) => {
      return Role.create(
        {
          projectId: raw.id,
          amount: projectRole.amount,
          name: Slug.createFromText(projectRole.role.name),
        },
        projectRole.role.id,
      );
    });

    const technologies = raw.technology.map((technology) => {
      return Technology.create(technology.slug, technology.id);
    });

    const teamMembers = raw.teamMember.map((teamMember) => {
      return Member.create(
        {
          recipientId: teamMember.recipientId,
          createdAt: teamMember.createdAt,
          permissionType: teamMember.permissionType,
          status: teamMember.status,
          updatedAt: teamMember.updatedAt,
        },
        teamMember.id,
      );
    });

    const project = Project.create({
      authorId: raw.authorId,
      content: raw.content,
      title: raw.title,
      requirements: Requirement.create({
        content: raw.requirementContent,
        timeAmount: raw.requirementTimeAmount,
        timeIdentifier: raw.requirementTimeIdentifier,
      }),
      roles: new ProjectRoleList(roles),
      technologies: new ProjectTechnologyList(technologies),
      teamMembers: new TeamMembersList(teamMembers),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt ?? undefined,
    });

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
        requirementContent: project.requirements.value.content,
        requirementTimeAmount: project.requirements.value.timeAmount,
        requirementTimeIdentifier: project.requirements.value.timeIdentifier,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
      rawTeamMembers: project.teamMembers,
      rawRoles: project.roles,
      rawTechnologies: project.technologies,
    };
  }
}
