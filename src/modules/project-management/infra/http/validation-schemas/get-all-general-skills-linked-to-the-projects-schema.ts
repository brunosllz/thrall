import { z } from 'zod';

export const getAllGeneralSkillsLinkedToTheProjectsQuerySchema = z.object({
  search: z.string().optional(),
});

export type GetAllGeneralSkillsLinkedToTheProjectsQuerySchema = z.infer<
  typeof getAllGeneralSkillsLinkedToTheProjectsQuerySchema
>;
