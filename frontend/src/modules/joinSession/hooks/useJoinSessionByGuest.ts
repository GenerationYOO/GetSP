import { joinGuestSession, getSessionByCode } from "../api/joinSession";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../../../shared/api/apiError";
import { setAccessToken } from "../../../shared/api/authToken";
import type { SessionDTO, JoinSessionFormError } from "../models/joinSessionForm";

const INVITE_CODE_REGEX = /^[A-HJ-NP-Z2-9]{8}$/;

export function useJoinSessionByGuest() {
  const [inviteInput, setInviteInput] = useState<string>("");
  const [guestName, setGuestName] = useState<string>("");
  const [formError, setFormError] = useState<JoinSessionFormError>({
    sessionId: "",
    guestName: ""
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  function extractInviteCode(input: string): string | null {
    const value = input.trim();
    let candidate: string;

    try {
      const url = new URL(value);
      candidate = url.pathname.split("/").filter(Boolean).at(-1) ?? "";
    } catch {
      candidate = value.split(/[/?#]/).filter(Boolean).at(-1) ?? "";
    }

    const code = candidate.toUpperCase();
    return INVITE_CODE_REGEX.test(code) ? code : null;
  }

  function handleGetSessionId(input: string) {
    setInviteInput(extractInviteCode(input) ?? input.trim());
  }

  async function handleJoinAsGuest() {
    setIsSubmitting(true);

    try {
      const validated = await validateForm();
      if (!validated)
        return;

      const joined = await joinGuestSession(
        validated.inviteCode,
        guestName.trim()
      );
      setAccessToken(joined.accessToken);

      navigate(`/sessions/${joined.sessionId}`, {
        state: {
          session: {
            ...validated.sessionInfo,
            id: joined.sessionId,
            participantCount: validated.sessionInfo.participantCount + 1,
          },
          guestName: joined.guestName,
        },
      });
    } catch (error) {
      setFormError((prev) => ({
        ...prev,
        guestName: getApiErrorMessage(error) || "Не удалось подключиться",
      }));
      console.error("Ошибки при подключении гостя:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function validateForm(): Promise<{
    inviteCode: string;
    sessionInfo: SessionDTO;
  } | null> {
    if (!handleValidateFields())
      return null;

    const inviteCode = extractInviteCode(inviteInput);
    if (!inviteCode) {
      setFormError((prev) => ({
        ...prev,
        sessionId: "Введите корректный 8-символьный код или ссылку",
      }));
      return null;
    }

    try {
      const sessionInfo = await getSessionByCode(inviteCode);
      return { inviteCode, sessionInfo };
    } catch (error) {
      setFormError((prev) => ({
        ...prev,
        sessionId: getApiErrorMessage(error) || "Сессия не найдена",
      }));
      console.error("Ошибки при получении сессии по коду:", error);
      return null;
    }
  }

  function handleValidateFields(): boolean {
    if (!inviteInput.trim()) {
      setFormError((prevError) => ({
        ...prevError,
        sessionId: "ID сессии не может быть пустым",
      }));
    }
    if (!guestName.trim()) {
      setFormError((prevError) => ({
        ...prevError,
        guestName: "Имя гостя не может быть пустым",
      }));
    }

    if (!inviteInput.trim() || !guestName.trim())
      return false;
    setFormError({
      guestName: "",
      sessionId: ""
    })
    return true;
  }

  return {
    formError,
    isSubmitting,
    setFormError,
    handleGetSessionId,
    setGuestName,
    handleJoinAsGuest,
  }
}