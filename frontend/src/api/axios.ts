import axios from 'axios';

export const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
});

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