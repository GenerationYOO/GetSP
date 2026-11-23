import { api } from "../../../shared/api/axios";

export function registerUser(name: string, email: string, password: string) {
  return api.post('/auth/register', {
    username: name,
    email,
    password
  })
}