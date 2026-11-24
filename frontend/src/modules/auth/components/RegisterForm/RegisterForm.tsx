import "./RegisterForm.css"
import { FormContainer } from "../../../../shared/components/FormContainer/FormContainer";
import { InputForm } from "../../../../shared/components/InputForm/InputForm";
import { ActionButton } from "../../../../shared/components/ActionButton/ActionButton";
import { AuthSwitch } from "../../../../shared/components/AuthSwitch/AuthSwitch";
import { useRegisterForm } from "../../hooks/useRegisterForm";
import { useNavigate } from "react-router-dom";
import userIcon from "../../../../shared/assets/icons/user1.svg";
import emailIcon from "../../../../shared/assets/icons/envelope.svg";
import passwordIcon from "../../../../shared/assets/icons/lock.svg";
import eyeIcon from "../../../../shared/assets/icons/eye.svg";
import eyeSlashIcon from "../../../../shared/assets/icons/eyeOff.svg";

export function RegisterForm() {
  const {
    formData,
    errors,
    formError,
    handleRegister,
    handleNameChange,
    handleNameBlur,
    handleEmailChange,
    handleEmailBlur,
    handlePasswordChange,
    handlePasswordBlur,
    handleConfirmPasswordChange,
    handleConfirmPasswordBlur
  } = useRegisterForm();
  const navigate = useNavigate();
  
  return (
    <div className="registerForm">
      <div className="projectLogo"></div>
      <h2 className="registerTitle">Регистрация</h2>
      <p className="registerDescription">Создание нового аккаунта</p>

      <FormContainer onSubmit={handleRegister}>
        <InputForm
          title="Ваше имя"
          type="name"
          value={formData.name}
          placeholder="Иван"
          leftIcon={userIcon}
          onChange={handleNameChange}
          error={errors.name}
          onBlur={handleNameBlur}
        />
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
          value={formData.password}
          placeholder="• • • • • • • •"
          leftIcon={passwordIcon}
          rightIcon={eyeIcon}
          rightIconActive={eyeSlashIcon}
          onChange={handlePasswordChange}
          error={errors.password}
          onBlur={handlePasswordBlur}
        />
        <div className="lastInput">
          <InputForm
            title="Повторите пароль"
            type="password"
            value={formData.confirmPassword}
            placeholder="• • • • • • • •"
            leftIcon={passwordIcon}
            rightIcon={eyeIcon}
            rightIconActive={eyeSlashIcon}
            onChange={handleConfirmPasswordChange}
            onBlur={handleConfirmPasswordBlur}
            error={errors.confirmPassword}
            description='Минимальная длина пароля - 8'
          />
        </div>

        <ActionButton
          type="submit"
          text="Зарегистрироваться"
        />
      </FormContainer>
      <div className="registerFooter">
        <p className="registerFooterDescription">Уже есть аккаунт?</p>
        <AuthSwitch
          text="Войти"
          onClick={() => navigate("/login")}
        />
      </div>
      {formError && <p className="registerFormError">{formError}</p>}
    </div>
  );
}