import { ProjectStatus } from '@modules/project-management/domain/entities/project';
import {
  MeetingType,
  WEEK_DAYS,
} from '@modules/project-management/domain/entities/value-objects/meeting';
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
    }),
  ),
  technologies: z.array(z.object({ slug: z.string() })),
  meeting: z.object({
    occurredTime: z.string(),
    type: z.nativeEnum(MeetingType),
    // .transform((value) => value?.toLocaleLowerCase()),
    date: z
      .string()
      .or(z.nativeEnum(WEEK_DAYS))
      .optional()
      .transform((value) => value?.toLocaleLowerCase()),
  }),
});

export type CreateProjectBodySchema = z.infer<typeof createProjectBodySchema>;
