import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "./authToken";

const baseURL = "/api/v1";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
});

let refreshPromise: Promise<string> | null = null;

type RetryConfig = InternalAxiosRequestConfig & {
  retry?: boolean;
};

export function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<{ accessToken: string }>("/Auth/refresh")
      .then(({ data }) => {
        if (!data.accessToken) {
          throw new Error("Refresh response did not contain an access token");
        }

        setAccessToken(data.accessToken);
        return data.accessToken;
      })
      .catch((error: unknown) => {
        clearAccessToken();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

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
    const url = (originalRequest.url ?? "").toLowerCase();

    if (
      originalRequest.retry ||
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh")
    ) {
      throw error;
    }

    originalRequest.retry = true;

    try {
      const accessToken = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      clearAccessToken();
      throw refreshError;
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