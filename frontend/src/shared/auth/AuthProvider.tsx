import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import * as authService from "../api/authService";
import { clearAccessToken } from "../api/authToken";
import type { AuthResponse, AuthUser } from "../api/authService";
import { AuthContext, type AuthStatus } from "./authContext";

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error("Authentication failed");
}

function isUnauthorized(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;

    async function initializeAuth() {
      try {
        await authService.refresh();
        if (!active) {
          return;
        }

        const currentUser = await authService.me();

        if (active) {
          setUser(currentUser);
          setStatus("authenticated");
        }
      } catch (authError) {
        if (!active) {
          return;
        }

        clearAccessToken();

        setUser(null);
        setStatus("unauthenticated");
        setError(isUnauthorized(authError) ? null : toError(authError));
      }
    }

    void initializeAuth();

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(
    async (
      email: string,
      password: string,
      rememberMe: boolean
    ): Promise<AuthResponse> => {
      setError(null);
      const response = await authService.login(email, password, rememberMe);
      setUser(response.user);
      setStatus("authenticated");
      return response;
    },
    []
  );

  const register = useCallback(
    (username: string, email: string, password: string) =>
      authService.register(username, email, password),
    []
  );

  const value = useMemo(
    () => ({ status, user, error, login, register }),
    [status, user, error, login, register]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
