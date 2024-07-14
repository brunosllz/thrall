import { z } from 'zod';

export const paginationParamsSchema = z.object({
  pageIndex: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
});

export type PaginationParams = z.infer<typeof paginationParamsSchema>;

export type PaginationResponse<T> = {
  total: number;
  perPage: number;
  page: number;
  lastPage: number;
  data: T[];
};
