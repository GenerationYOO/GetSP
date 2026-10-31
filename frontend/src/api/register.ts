import { api } from "./axios";

export function registerUser(name: string, email: string, password: string) {
  return api.post('/auth/register', {
    name,
    email,
    password
  })
}