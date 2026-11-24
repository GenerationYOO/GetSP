import { api } from "../../../shared/api/axios";
import { setAccessToken } from "../../../shared/api/authToken";

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  role: string;
};

export type AuthResponse = {
  user: AuthUser;
  accessToken: string;
  expiresIn: number;
};

export async function loginUser(
  email: string,
  password: string,
  rememberMe: boolean
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
    rememberMe,
  });

  setAccessToken(data.accessToken);
  return data;
}