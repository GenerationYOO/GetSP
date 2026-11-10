import "./CreateSession.css"
import { useState } from "react";
import { PageLayout } from "../../components/PageLayout/PageLayout"
import { SurfaceCard } from "../../components/SurfaceCard/SurfaceCard"
import { InputForm } from "../../components/InputForm/InputForm"
import { FormContainer } from "../../components/FormContainer/FormContainer"
import { SpreadsheetUploader } from "../../components/SpreadsheetUploader/SpreadsheetUploader"
import { ActionButton } from "../../components/ActionButton/ActionButton"
import pensilLineIcon from "../../assets/icons/pencil-line.svg"
import YouTrackIcon from "../../assets/icons/youtrack.svg"


type ImportFormErrors = {
  name?: string;
  file?: string;
  youTrackLink?: string;
};
export function SessionCreation() {
  const [sessionName, setSessionName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [youTrackLink, setYouTrackLink] = useState("");
  const [errors, setErrors] = useState<ImportFormErrors>({});

  const canImport = Boolean(youTrackLink.trim() || file && sessionName.trim());

  function validateForm(): boolean {
    const newErrors: ImportFormErrors = {};
    if (!sessionName.trim()) {
      newErrors.name = "Введите название сессии";
    }
    if (!file && !youTrackLink.trim()) {
      newErrors.file = "Выберите файл";
      newErrors.youTrackLink = "Добавьте ссылку на YouTrack";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleImport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    if (file) {
      console.log("Importing from file:", file);
    } else if (youTrackLink.trim()) {
      console.log("Importing from YouTrack link:", youTrackLink);
    }
  }

  async function onRightButtonClick() {
    const text = await navigator.clipboard.readText();
    if (!file) {
      setYouTrackLink(text);
    }
  }

  return (
    <PageLayout>
      <SurfaceCard>
        <h2 className="createSessionTitle">Создание сессии</h2>
        <FormContainer onSubmit={handleImport}>
          <InputForm
            title="Название сессии"
            leftIcon={pensilLineIcon}
            type="text"
            placeholder="Введите название сессии"
            value={sessionName}
            onChange={setSessionName}
            error={errors.name}
          />
          <SpreadsheetUploader
            title="Загрузите файл EXCEL или CSV"
            disabled={Boolean(youTrackLink.trim())}
            onFileSelect={setFile}
            error={errors.file}
            selectedFile={file}
            setSelectedFile={setFile}
          />
          <div className="divider">
            <span>или</span>
          </div>
          <InputForm
            title="Ссылка на YouTrack"
            leftIcon={YouTrackIcon}
            type="text"
            placeholder="Добавьте ссылку на задачи"
            value={youTrackLink}
            disabled={Boolean(file)}
            onChange={setYouTrackLink}
            rightButtonText="Вставить"
            onRightButtonClick={onRightButtonClick}
            error={errors.youTrackLink}
          />
          <ActionButton
            text="Импорт"
            disabled={!canImport}
          />
        </FormContainer>
      </SurfaceCard>
    </PageLayout>
  )
}
