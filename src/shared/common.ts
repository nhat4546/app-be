export type Pagination = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type ResponseFormat = {
  status: number;
  message: string;
  data?: any;
  pagination?: Pagination;
};
