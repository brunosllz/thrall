import { Slug } from '@/common/domain/entities/value-objects/slug';
import { Interested } from '@/modules/project-management/domain/entities/interested';
import { Skill } from '@/modules/project-management/domain/entities/skill';
import { UnitTimeType } from '@/modules/project-management/domain/entities/value-objects/available-to-participate';
import { ProjectGeneralSkillList } from '@/modules/project-management/domain/entities/watched-lists/project-general-skill-list';
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
import { Content } from '@modules/project-management/domain/entities/value-objects/content';
import { ProjectRoleList } from '@modules/project-management/domain/entities/watched-lists/project-role-list';
import { TeamMembersList } from '@modules/project-management/domain/entities/watched-lists/team-members-list';
import {
  Answer as RawAnswer,
  Project as RawProject,
  Skill as RawSkill,
  TeamMember as RawTeamMember,
  InterestedInProject as RawInterestedInProject,
} from '@prisma/client';

type ToDomainRawProps = RawProject & {
  projectRoles: Array<{
    membersAmount: number;
    description: string;
    role: {
      id: string;
      name: string;
    };
  }>;
  skills: RawSkill[];
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
          description: new Content(projectRole.description),
        },
        projectRole.role.id,
      ).getValue();
    });

    const skills = raw.skills.map((skill) => {
      return Skill.create(skill.slug, skill.id).getValue();
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
        bannerUrl: raw.bannerUrl ?? undefined,
        status: raw.status as ProjectStatus,
        roles: new ProjectRoleList(roles),
        generalSkills: new ProjectGeneralSkillList(skills),
        teamMembers: new TeamMembersList(teamMembers),
        interested: new ProjectInterestedList(interested),
        availableToParticipate: {
          value: {
            availableDays: raw.availableDays,
            availableTime: {
              unit: raw.availableTimeUnit as UnitTimeType,
              value: raw.availableTimeValue,
            },
          },
        },
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
        bannerUrl: project.bannerUrl ?? null,
        availableDays: project.availableToParticipate.value.availableDays,
        availableTimeValue:
          project.availableToParticipate.value.availableTime.value,
        availableTimeUnit:
          project.availableToParticipate.value.availableTime.unit,
        status: project.status,
        slug: project.slug.value,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
      rawTeamMembers: project.teamMembers,
      rawRoles: project.roles,
      rawSkills: project.generalSkills,
      rawInterested: project.interested,
    };
  }
}
