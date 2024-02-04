export type Paging = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type ResponseFormat = {
  status: number;
  message: string;
  data?: any;
  paging?: Paging;
};
