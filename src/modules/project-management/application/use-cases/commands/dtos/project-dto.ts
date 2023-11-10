import { UnitTimeType } from '@/modules/project-management/domain/entities/value-objects/available-to-participate';
import { ProjectStatus } from '@modules/project-management/domain/entities/project';

import { RoleDTO } from './role-dto';
import { SkillDTO } from './skill-dto';

export interface ProjectDTO {
  authorId: string;
  description: string;
  status: ProjectStatus;
  imageUrl: string;
  bannerUrl?: string;
  name: string;
  roles: Array<RoleDTO>;
  generalSkills: Array<SkillDTO>;
  availableToParticipate: {
    availableDays: number[];
    availableTime: {
      value: number;
      unit: UnitTimeType;
    };
  };
}
