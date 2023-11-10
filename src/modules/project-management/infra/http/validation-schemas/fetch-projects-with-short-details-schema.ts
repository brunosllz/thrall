import { z } from 'zod';

export const fetchProjectsWithShortDetailsQuerySchema = z.object({
  role: z.string().optional(),
  skill: z.string().optional(),
  page: z.coerce.number().optional(),
  date: z.enum(['recent', 'day', 'week', 'month']).optional(),
});

export type FetchProjectsWithShortDetailsQuerySchema = z.infer<
  typeof fetchProjectsWithShortDetailsQuerySchema
>;
