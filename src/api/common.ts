export type Result<T> = {
  code: number;
  msg: string;
  data?: T;
};

export type PageParams = {
  page?: number;
  page_size: number;
};

export type PageResult<T> = {
  total: number;
  list: T[];
};
