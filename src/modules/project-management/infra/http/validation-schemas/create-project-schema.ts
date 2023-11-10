import { UnitTimeType } from '@/modules/project-management/domain/entities/value-objects/available-to-participate';
import { ProjectStatus } from '@modules/project-management/domain/entities/project';
import { z } from 'zod';

export const createProjectBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  requirements: z.string(),
  imageUrl: z.string().url(),
  status: z.nativeEnum(ProjectStatus),
  roles: z.array(
    z.object({
      membersAmount: z.number(),
      name: z.string(),
      description: z.string(),
    }),
  ),
  availableToParticipate: z.object({
    availableDays: z.array(z.number()),
    availableTime: z.object({
      value: z.number(),
      unit: z.nativeEnum(UnitTimeType),
    }),
  }),
  generalSkills: z.array(z.object({ slug: z.string() })),
});

export type CreateProjectBodySchema = z.infer<typeof createProjectBodySchema>;
