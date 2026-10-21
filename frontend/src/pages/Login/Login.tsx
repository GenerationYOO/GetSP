import './Login.css'
import { InputRegisterForm } from '../../components/InputRegisterForm/InputRegisterForm'
import emailIcon from '../../assets/icons/envelope.svg'
import passwordIcon from '../../assets/icons/lock.svg'
import eyeIcon from '../../assets/icons/eye.svg'
import eyeSlashIcon from '../../assets/icons/eyeOff.svg'
import { Checkbox } from '../../components/Checkbox/Checkbox'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { loginUser } from '../../api/login'
import { AuthButton } from '../../components/AuthButton/AuthButton'
import { AuthSwitch } from '../../components/AuthSwitch/AuthSwitch'

type LoginFormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};
type LoginFormErrors = {
  email?: string;
  password?: string;
};
export function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const loginButtonDisabled = !formData.email || !formData.password;

  function validateForm() {
    const newErrors: LoginFormErrors = {};
    if (!formData.email) {
      newErrors.email = 'Введите вашу электронную почту';
    }
    if (!formData.password) {
      newErrors.password = 'Введите ваш пароль';
    }

    setErrors(newErrors);

    return Object.keys(errors).length === 0;
  }

  async function loginHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      try {
        await loginUser(formData.email, formData.password, formData.rememberMe);
        navigate('/home');
      } catch (error) {
        console.error('Ошибка при входе:', error);
      }
    }
  }

  return (
    <div className="loginPage">
      <div className="loginForm">
        <h2 className="loginFormTitle">Добро пожаловать</h2>
        <p className="loginFormDescription">Войдите в свою учетную запись</p>

        <form className="loginFormFields" onSubmit={loginHandler}>
          <InputRegisterForm
            title="Электронная почта"
            type="email"
            placeholder="name@example.com"
            leftIcon={emailIcon}
            onChange={(value) => setFormData(prev => ({
              ...prev,
              email: value
            }))}
            error={errors.email}
          />
          <InputRegisterForm
            title="Пароль"
            type="password"
            placeholder="• • • • • • • •"
            leftIcon={passwordIcon}
            rightIcon={eyeIcon}
            rightIconActive={eyeSlashIcon}
            onChange={(value) => setFormData(prev => ({
              ...prev,
              password: value
            }))}
            error={errors.password}
          />
          <div className="loginFormCheckbox">
            <Checkbox
              checked={formData.rememberMe}
              onChange={(checked) => setFormData(prev => ({
                ...prev,
                rememberMe: checked
              }))}
            />
            <label htmlFor="checkbox">Запомнить меня</label>
          </div>
          <AuthButton
            disabled={loginButtonDisabled}
            text="Войти"
          />
        </form>
        <div className="loginFooter">
          <p className="loginFooterDescription">Еще нет аккаунта?</p>
          <AuthSwitch
            text="Регистрация"
            onClick={() => navigate("/register")}
          />
        </div>

      </div>
    </div>
  )
}