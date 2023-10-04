export interface PaginationParams {
  pageIndex: number;
  pageSize: number;
}

export type PaginationQueryResponse = {
  total: number;
  perPage: number;
  page: number;
  lastPage: number;
  data: any[];
};
