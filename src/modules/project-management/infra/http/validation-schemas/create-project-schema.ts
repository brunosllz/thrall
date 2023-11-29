import { UnitTimeType } from '@/modules/project-management/domain/entities/value-objects/available-to-participate';
import { z } from 'zod';

export const createProjectBodySchema = z.object({
  bannerUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  name: z.string(),
  availableToParticipate: z.object({
    availableDays: z.array(z.coerce.number()),
    availableTime: z.object({
      value: z.coerce.number(),
      unit: z.nativeEnum(UnitTimeType),
    }),
  }),
  description: z.string(),
  generalSkills: z.array(z.object({ slug: z.string() })),
  roles: z.array(
    z.object({
      membersAmount: z.coerce.number(),
      name: z.string(),
      description: z.string(),
    }),
  ),
});

export type CreateProjectBodySchema = z.infer<typeof createProjectBodySchema>;
