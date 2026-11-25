import { api } from "../../../shared/api/api";
import type { CreateSessionForm, CreateSessionResponse } from "../models/createSessionForm";


export async function createSession(
  form: CreateSessionForm): Promise<CreateSessionResponse> {
  const { data } = await api.post<CreateSessionResponse>("/Sessions", form);

  return data;
}