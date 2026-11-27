import axios from "axios";


type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
  error?: Record<string, string[]>;
};

export function getApiErrorMessage(error: unknown): string | undefined {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const data = error.response?.data;

    if (data?.message) 
      return data.message;

    const messages = data?.errors ?? data?.error;
    const firstMessage = Object.values(messages ?? {}).flat()[0];
    
    if (firstMessage) 
      return firstMessage;
  }

  return error instanceof Error ? error.message : undefined;
}