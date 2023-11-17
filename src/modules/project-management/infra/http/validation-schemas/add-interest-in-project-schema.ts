import { z } from 'zod';

export const addInterestInProjectParamsSchema = z.object({
  projectId: z.string().uuid(),
});

export type AddInterestInProjectParamsSchema = z.infer<
  typeof addInterestInProjectParamsSchema
>;
