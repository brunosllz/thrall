import { UnitTimeType } from '@/modules/project-management/domain/entities/value-objects/available-to-participate';
import { z } from 'zod';

export const updateProjectBodySchema = z.object({
  bannerUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  name: z.string().optional(),
  availableToParticipate: z
    .object({
      availableDays: z.array(z.coerce.number()),
      availableTime: z.object({
        value: z.coerce.number(),
        unit: z.nativeEnum(UnitTimeType),
      }),
    })
    .optional(),
  description: z.string().optional(),
  generalSkills: z.array(z.object({ slug: z.string() })).optional(),
  jobs: z
    .array(
      z.object({
        id: z.string().optional(),
        jobAmountAvailable: z.coerce.number(),
        name: z.string(),
        description: z.string(),
      }),
    )
    .optional(),
});

export type UpdateProjectBodySchema = z.infer<typeof updateProjectBodySchema>;
