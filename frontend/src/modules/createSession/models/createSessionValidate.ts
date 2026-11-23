import type { ImportFormErrors } from "./createSessionForm";

type ValidateFormParams = {
  sessionName: string;
  file: File | null;
  youTrackLink: string;
};

type ValidateFormResult = {
  isValid: boolean;
  errors: ImportFormErrors;
};

export function validateForm({
  sessionName,
  file,
  youTrackLink }: ValidateFormParams): ValidateFormResult {
  const newErrors: ImportFormErrors = {};
  if (!sessionName.trim()) {
    newErrors.name = "Введите название сессии";
  }
  if (!file && !youTrackLink.trim()) {
    newErrors.file = "Выберите файл";
    newErrors.youTrackLink = "Добавьте ссылку на YouTrack";
  }
  
  return {
    isValid: Object.keys(newErrors).length === 0,
    errors: newErrors
  };
}