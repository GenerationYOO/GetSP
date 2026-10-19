import { api } from "./axios";

export function loginUser(email: string, password: string) {
  return api.post('/login', {
    email,
    password
  })
}