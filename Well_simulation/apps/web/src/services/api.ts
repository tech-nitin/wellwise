import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { ApiError } from "@/types/api";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor: attach bearer token if available
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("wellwise_auth_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: extract response data or standardize ApiError
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ message?: string; code?: string; details?: unknown }>) => {
    const apiError: ApiError = {
      message:
        error.response?.data?.message ||
        error.message ||
        "An unexpected network error occurred.",
      statusCode: error.response?.status || 500,
      code: error.response?.data?.code || error.code || "NETWORK_ERROR",
      details: error.response?.data?.details,
    };
    return Promise.reject(apiError);
  }
);

/**
 * Generic API helper methods
 */
export async function apiGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const res = await apiClient.get<T>(url, { params });
  return res.data;
}

export async function apiPost<T>(url: string, data?: unknown): Promise<T> {
  const res = await apiClient.post<T>(url, data);
  return res.data;
}

export async function apiPut<T>(url: string, data?: unknown): Promise<T> {
  const res = await apiClient.put<T>(url, data);
  return res.data;
}

export async function apiDelete<T>(url: string): Promise<T> {
  const res = await apiClient.delete<T>(url);
  return res.data;
}
