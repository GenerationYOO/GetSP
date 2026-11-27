export type JoinSessionResponse = {
  participantId: string;
  guestName: string;
  sessionId: string;
  accessToken: string;
}

export type SessionDTO = {
  id: string;
  name: string;
  ownerName: string;
  status: string;
  participantCount: number;
}

export type JoinSessionFormError = {
  sessionId: string;
  guestName: string;
};