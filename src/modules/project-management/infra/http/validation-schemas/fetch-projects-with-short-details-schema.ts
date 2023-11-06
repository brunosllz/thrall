import { z } from 'zod';

export const fetchProjectsWithShortDetailsQuerySchema = z.object({
  role: z.string().optional(),
  tech: z.string().optional(),
  pageIndex: z.coerce.number().optional(),
  date: z.enum(['now', 'day', 'week', 'month']).optional(),
});

export type FetchProjectsWithShortDetailsQuerySchema = z.infer<
  typeof fetchProjectsWithShortDetailsQuerySchema
>;
