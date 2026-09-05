/**
 * Standard API Response and Pagination contracts for WellWise.
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiPaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  timestamp: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  code?: string;
  details?: unknown;
}
