import { api } from "./axios";

export function loginUser(email: string, password: string, rememberMe: boolean) {
  return api.post('/auth/login', {
    email,
    password,
    rememberMe
  })
}