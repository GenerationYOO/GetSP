import { api } from "../../../shared/api/api";
import type { JoinSessionResponse, SessionDTO } from "../models/joinSessionForm";

export async function joinGuestSession(
  code: string,
  guestName: string
): Promise<JoinSessionResponse> {
  const { data } = await api.post<JoinSessionResponse>(
    `/Sessions/join/${encodeURIComponent(code)}`,
    { guestName });
  return data;
}

export async function getSessionByCode(
  code: string
): Promise<SessionDTO> {
  const { data } = await api.get<SessionDTO>(
    `/Sessions/join/${encodeURIComponent(code)}`
  );
  return data;
}

