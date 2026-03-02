export type TDecodedToken = {
  role: string;
  iat: number;
  exp: number;
};

export type TError = {
  data?: {
    message?: string;
    stack?: string;
    success?: boolean;
  };
  status?: number;
  message?: string;
};

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
