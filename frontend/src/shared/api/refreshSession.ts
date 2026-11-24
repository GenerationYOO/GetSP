import axios from "axios";
import { setAccessToken, clearAccessToken } from "./authToken";

const refreshClient = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

export async function refreshSession(): Promise<boolean> {
  try {
    const { data } = await refreshClient.post<{
      accessToken: string;
    }>("/auth/refresh");

    if (!data.accessToken) {
      clearAccessToken();
      return false;
    }

    setAccessToken(data.accessToken);
    return true;
  } catch {
    clearAccessToken();
    return false;
  }
}