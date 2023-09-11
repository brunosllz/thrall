import { ProjectStatus } from '@modules/project-management/domain/entities/project';

import { MeetingDTO } from './meeting-dto';
import { RoleDTO } from './role-dto';
import { TechnologyDTO } from './technology-dto';

export interface ProjectDTO {
  authorId: string;
  description: string;
  status: ProjectStatus;
  imageUrl: string;
  name: string;
  meeting: MeetingDTO;
  roles: Array<RoleDTO>;
  technologies: Array<TechnologyDTO>;
  requirements: string;
}
