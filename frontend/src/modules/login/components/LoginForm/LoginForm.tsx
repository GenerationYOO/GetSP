import "./LoginForm.css"
import { useNavigate } from "react-router-dom";
import { useLoginForm } from "../../hooks/useLoginForm";
import { FormContainer } from "../../../../shared/components/FormContainer/FormContainer";
import { InputForm } from "../../../../shared/components/InputForm/InputForm";
import { Checkbox } from "../../../../shared/components/Checkbox/Checkbox";
import { ActionButton } from "../../../../shared/components/ActionButton/ActionButton";
import { AuthSwitch } from "../../../../shared/components/AuthSwitch/AuthSwitch";
import emailIcon from '../../../../shared/assets/icons/envelope.svg'
import passwordIcon from '../../../../shared/assets/icons/lock.svg'
import eyeIcon from '../../../../shared/assets/icons/eye.svg'
import eyeSlashIcon from '../../../../shared/assets/icons/eyeOff.svg'

export function LoginForm() {
  const {
    formData,
    errors,
    formError,
    handleLogin,
    handleEmailChange,
    handleEmailBlur,
    handlePasswordChange,
    handlePasswordBlur,
    handleCheckboxChange
  } = useLoginForm();
  const navigate = useNavigate();

  return (
    <div className="loginForm">
      <h2 className="loginFormTitle">Добро пожаловать</h2>
      <p className="loginFormDescription">Войдите в свою учетную запись</p>

      <FormContainer onSubmit={handleLogin}>
        <InputForm
          title="Электронная почта"
          type="email"
          value={formData.email}
          placeholder="name@example.com"
          leftIcon={emailIcon}
          onChange={handleEmailChange}
          error={errors.email}
          onBlur={handleEmailBlur}
        />
        <InputForm
          title="Пароль"
          type="password"
          placeholder="• • • • • • • •"
          leftIcon={passwordIcon}
          value={formData.password}
          rightIcon={eyeIcon}
          rightIconActive={eyeSlashIcon}
          onChange={handlePasswordChange}
          error={errors.password}
          onBlur={handlePasswordBlur}
        />
        <div className="loginFormCheckbox">
          <Checkbox
            checked={formData.rememberMe}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="checkbox">Запомнить меня</label>
        </div>
        <ActionButton
          text="Войти"
        />
      </FormContainer>
      <div className="loginFooter">
        <p className="loginFooterDescription">Еще нет аккаунта?</p>
        <AuthSwitch
          text="Регистрация"
          onClick={() => navigate("/register")}
        />
      </div>
      {formError && <p className="loginFormError">{formError}</p>}
    </div>
  );
}