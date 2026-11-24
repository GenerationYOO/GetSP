import { createContext } from "react";
import type { AuthResponse, AuthUser } from "../api/authService";

export type AuthStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated";

export type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  error: Error | null;
  login: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<AuthResponse>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<AuthResponse>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
