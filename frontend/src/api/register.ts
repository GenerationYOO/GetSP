import { api } from "./axios";

export function registerUser(name: string, email: string, password: string) {
  return api.post('/register', {
    name,
    email,
    password
  })
}