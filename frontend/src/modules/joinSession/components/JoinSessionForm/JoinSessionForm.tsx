import "./JoinSessionForm.css";
import { JoinSessionInput } from "../JoinSessionInput/JoinSessionInput";
import { ActionButton } from "../../../../shared/components/ActionButton/ActionButton";
import link from "../../../../shared/assets/icons/link.svg";
import { useJoinSessionByGuest } from "../../hooks/useJoinSessionByGuest";

export function JoinSessionForm() {
  const {
    formError,
    isSubmitting,
    setFormError,
    handleGetSessionId,
    setGuestName,
    handleJoinAsGuest,
  } = useJoinSessionByGuest();


  return (
    <div className="joinSessionForm__container">
      <div className="joinSessionForm">
        <h2 className="joinSessionForm__title">Присоединиться к сессии</h2>
        <JoinSessionInput
          placeholder="Введите имя гостя"
          leftIcon={link}
          title="Имя гостя"
          type="text"
          onChange={(value) => {
            setGuestName(value);
            setFormError((prevError) => ({
              ...prevError,
              guestName: "",
            }));
          }
          }
          error={formError.guestName}
        />
        <JoinSessionInput
          placeholder="Вставьте ссылку или код"
          leftIcon={link}
          title="Ссылка или код сессии"
          type="text"
          onChange={(value) => {
            handleGetSessionId(value);
            setFormError((prevError) => ({
              ...prevError,
              sessionId: "",
            }));
          }}
          error={formError.sessionId}
        />
        <ActionButton
          text="Подключиться"
          disabled={isSubmitting}
          onClick={() => handleJoinAsGuest()}
        />
      </div>

      <span className="joinSessionForm__devider"></span>

      <div className="joinSessionForm__recentSessions">
        <h3 className="joinSessionForm__recentSessionsTitle">Недавние сессии</h3>
      </div>

    </div >
  );
}