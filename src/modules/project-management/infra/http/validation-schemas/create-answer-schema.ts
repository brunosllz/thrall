import { z } from 'zod';

export const createAnswerBodySchema = z.object({
  projectId: z.string().uuid(),
  content: z.string(),
});

export type CreateAnswerBodySchema = z.infer<typeof createAnswerBodySchema>;
