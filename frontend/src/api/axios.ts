import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { getAccessToken, clearAccessToken } from "./authToken";
import { refreshSession } from "./refreshSession";

export const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});

let refreshPromise: Promise<boolean> | null = null;

type RetryConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (!error.config || error.response?.status !== 401) {
      throw error;
    }

    const originalRequest = error.config as RetryConfig;
    const url = originalRequest.url ?? "";

    if (
      originalRequest._retry ||
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh")
    ) {
      throw error;
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshSession().finally(() => {
          refreshPromise = null;
        });
      }

      const refreshed = await refreshPromise;

      if (!refreshed) {
        clearAccessToken();
        throw error;
      }

      const accessToken = getAccessToken();

      if (!accessToken) {
        clearAccessToken();
        throw error;
      }

      originalRequest.headers.Authorization =
        `Bearer ${accessToken}`;

      return api(originalRequest);
    } catch {
      clearAccessToken();
      throw error;
    }
  }
);

api.interceptors.response.use(
  response => response,
  error => {
    if (axios.isAxiosError(error)) {
      console.error('========== API ERROR ==========');
      console.error('Status:', error.response?.status);
      console.error('Method:', error.config?.method?.toUpperCase());
      console.error('URL:', error.config?.url);
      console.error('Response:', error.response?.data);
      console.error('Message:', error.message);
      console.log('Validation errors:', error.response?.data?.errors);
      console.error('================================');
    }

    return Promise.reject(error);
  }
);