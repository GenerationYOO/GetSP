import "./CreateSessionForm.css"
import { FormContainer } from "../../../shared/components/FormContainer/FormContainer";
import { InputForm } from "../../../shared/components/InputForm/InputForm";
import { SpreadsheetUploader } from "../../../shared/components/SpreadsheetUploader/SpreadsheetUploader";
import { ActionButton } from "../../../shared/components/ActionButton/ActionButton";
import { useCreateSessionForm } from "../hooks/useCreateSessionForm";
import pensilLineIcon from "../../../shared/assets/icons/pencil-line.svg"
import YouTrackIcon from "../../../shared/assets/icons/youtrack1.svg"

export function CreateSessionForm() {
  const {
    sessionName,
    file,
    youTrackLink,
    errors,
    formError,
    canImport,
    handleImport,
    isImporting,
    handlePasteYouTrackLink,
    handleSessionNameChange,
    handleFileSelect,
    handleYouTrackLinkChange
  } = useCreateSessionForm();

  return (
    <div className="createSessionForm">
      <h2 className="createSessionTitle">Создание сессии</h2>
      <FormContainer onSubmit={handleImport}>
        <InputForm
          title="Название сессии"
          leftIcon={pensilLineIcon}
          type="text"
          placeholder="Введите название сессии"
          value={sessionName}
          onChange={handleSessionNameChange}
          error={errors.name}
        />
        <SpreadsheetUploader
          title="Загрузите файл EXCEL или CSV"
          disabled={Boolean(youTrackLink.trim())}
          onFileSelect={handleFileSelect}
          error={errors.file}
          selectedFile={file}
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
          onChange={handleYouTrackLinkChange}
          rightButtonText="Вставить"
          onRightButtonClick={handlePasteYouTrackLink}
          error={errors.youTrackLink}
        />
        <ActionButton
          text="Импорт"
          disabled={!canImport || isImporting}
          type="submit"
        />
        {formError && (
          <p className="createSessionFormError">
            {formError}
          </p>
        )}
      </FormContainer>
    </div>
  );
}