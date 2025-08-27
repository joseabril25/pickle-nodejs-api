export interface PaginatedResponseDto<T> {
  status: number;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface ApiResponseDto<T = any> {
  status: number;
  message: string;
  data?: T;
}

export interface ApiErrorDto {
  status: number;
  message: string;
  error?: {
    code: string;
    details?: any;
  };
}