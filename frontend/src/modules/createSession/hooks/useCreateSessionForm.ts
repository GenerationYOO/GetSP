import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { previewImport } from "../api/importPreview";
import { validateForm } from "../models/createSessionValidate";
import type { ImportFormErrors } from "../models/createSessionForm";

export function useCreateSessionForm() {
  const navigate = useNavigate();
  const [sessionName, setSessionName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [youTrackLink, setYouTrackLink] = useState("");
  const [errors, setErrors] = useState<ImportFormErrors>({});
  const [formError, setFormError] = useState<string>();
  const [isImporting, setIsImporting] = useState(false);

  const canImport = Boolean(
    sessionName.trim() &&
    (file || youTrackLink.trim())
  );

  async function handleImport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isImporting) {
      return;
    }

    const result = validateForm({
      sessionName,
      file,
      youTrackLink,
    });
    setErrors(result.errors);
    const isValid = result.isValid;

    if (!isValid || !file) {
      return;
    }

    try {
      setIsImporting(true);
      setFormError(undefined);
      const data = await previewImport(file);

      navigate("/create-session/preview", {
        state: { sessionName, data }
      });
    } catch (error) {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data as
          | { message?: string; detail?: string; title?: string }
          | undefined;

        const backendMessage =
          data?.detail ||
          data?.message ||
          data?.title;
        if (status === 400) {
          setFormError(
            backendMessage || "Некорректный файл для импорта"
          );
        } else if (status === 404) {
          setFormError("Сервис импорта задач не найден");
        } else {
          setFormError(
            backendMessage || "Не удалось импортировать файл"
          );
        }
      } else {
        setFormError("Не удалось импортировать файл");
      }

      console.error("Ошибка импорта:", error);
    } finally {
      setIsImporting(false);
    }
  }

  function handleSessionNameChange(value: string) {
    setSessionName(value);
    setFormError(undefined);

    if (errors.name) {
      setErrors(prev => ({
        ...prev,
        name: value.trim() ? undefined : prev.name
      }));
    }
  }

  function handleFileSelect(file: File | null) {
    setFile(file);
    setFormError(undefined);
    setErrors(prev => ({ ...prev, file: undefined }));
  }

  function handleYouTrackLinkChange(value: string) {
    setYouTrackLink(value);
    setFormError(undefined);
    setErrors(prev => ({
      ...prev,
      youTrackLink: undefined
    }));
  }

  async function handlePasteYouTrackLink() {
    if (file) return;

    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        setYouTrackLink(text.trim());
      }
    } catch {
      setFormError("Не удалось прочитать буфер обмена");
    }
  }
  return {
    sessionName,
    file,
    youTrackLink,
    errors,
    formError,
    canImport,
    isImporting,
    handleImport,
    handlePasteYouTrackLink,
    handleSessionNameChange,
    handleFileSelect,
    handleYouTrackLinkChange
  };
}