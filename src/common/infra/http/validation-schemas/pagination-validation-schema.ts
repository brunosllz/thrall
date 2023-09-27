import { z } from 'zod';

export const paginationValidationSchema = z.object({
  pageIndex: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
});

export type PaginationValidationSchema = z.infer<
  typeof paginationValidationSchema
>;
