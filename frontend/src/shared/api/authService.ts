import { api, refreshAccessToken } from "./api";
import { setAccessToken } from "./authToken";

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

export async function login(
  email: string,
  password: string,
  rememberMe: boolean
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/Auth/login", {
    email,
    password,
    rememberMe,
  });

  setAccessToken(data.accessToken);
  return data;
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/Auth/register", {
    username,
    email,
    password,
  });

  return data;
}

export async function refresh(): Promise<void> {
  await refreshAccessToken();
}

export async function me(): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>("/Auth/me");
  return data;
}
