import { Interested } from '@/modules/project-management/domain/entities/interested';
import { Job } from '@/modules/project-management/domain/entities/job';
import { Skill } from '@/modules/project-management/domain/entities/skill';
import { UnitTimeType } from '@/modules/project-management/domain/entities/value-objects/available-to-participate';
import { MembersIdsAssignedList } from '@/modules/project-management/domain/entities/watched-lists/members-ids-assigned-list';
import { ProjectGeneralSkillList } from '@/modules/project-management/domain/entities/watched-lists/project-general-skill-list';
import { ProjectInterestedList } from '@/modules/project-management/domain/entities/watched-lists/project-interested-list';
import { ProjectJobList } from '@/modules/project-management/domain/entities/watched-lists/project-job-list';
import {
  Member,
  MemberStatus,
  PermissionType,
} from '@modules/project-management/domain/entities/member';
import {
  Project,
  ProjectStatus,
} from '@modules/project-management/domain/entities/project';
import { Content } from '@modules/project-management/domain/entities/value-objects/content';
import { TeamMembersList } from '@modules/project-management/domain/entities/watched-lists/team-members-list';
import {
  Project as RawProject,
  Skill as RawSkill,
  TeamMember as RawTeamMember,
  InterestedInProject as RawInterestedInProject,
} from '@prisma/client';

type ToDomainRawProps = RawProject & {
  projectJobs: Array<{
    id: string;
    membersAmount: number;
    description: string;
    role: {
      name: string;
      slug: string | null;
    };
    member: {
      recipientId: string;
    }[];
  }>;
  skills: RawSkill[];

  teamMembers: RawTeamMember[];
  interestedInProject: RawInterestedInProject[];
};

export class ProjectMapper {
  static toDomain(raw: ToDomainRawProps): Project {
    const jobs = raw.projectJobs.map((job) => {
      return Job.create(
        {
          projectId: raw.id,
          jobAmountAvailable: job.membersAmount,
          name: job.role.name,
          description: new Content(job.description),
          membersIdsAssigned: new MembersIdsAssignedList(
            job.member.map((member) => member.recipientId),
          ),
        },
        job.id,
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
        imageUrl: raw.imageUrl ?? undefined,
        bannerUrl: raw.bannerUrl ?? undefined,
        status: raw.status as ProjectStatus,
        jobs: new ProjectJobList(jobs),
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
        imageUrl: project.imageUrl ?? null,
        bannerUrl: project.bannerUrl ?? null,
        availableDays: project.availableToParticipate.value.availableDays.map(
          (day) => Number(day),
        ),
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
      rawProjectJobs: project.jobs,
      rawSkills: project.generalSkills,
      rawInterested: project.interested,
    };
  }
}
