import './Login.css'
import { InputRegisterForm } from '../../components/InputRegisterForm/InputRegisterForm'
import emailIcon from '../../assets/icons/envelope.svg'
import passwordIcon from '../../assets/icons/lock.svg'
import eyeIcon from '../../assets/icons/eye.svg'
import eyeSlashIcon from '../../assets/icons/eyeOff.svg'
import { Checkbox } from '../../components/Checkbox/Checkbox'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { isAxiosError } from 'axios'
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

type LoginValidationErrors = Record<string, string[]>;

function getBackendErrors(
  validationErrors: LoginValidationErrors | undefined
): LoginFormErrors {
  if (!validationErrors) {
    return {};
  }

  const getError = (field: string): string | undefined => {
    const messages = validationErrors[field] ??
      validationErrors[field.toLowerCase()];
    return messages?.join(' ');
  };

  return {
    email: getError('Email'),
    password: getError('Password')
  };
}

export function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const [touched, setTouched] = useState({
    email: false,
    password: false
  })

  function validateForm() {
    const newErrors: LoginFormErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Введите вашу электронную почту';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Введите ваш пароль';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      try {
        await loginUser(formData.email, formData.password, formData.rememberMe);
        navigate('/home');
      } catch (error) {
        console.error('Ошибка при входе:', error);

        if (isAxiosError(error)) {
          const data = error.response?.data;

          const validationErrors = data?.errors as
            | LoginValidationErrors
            | undefined;

          const backendErrors = getBackendErrors(validationErrors);

          setErrors(prev => ({
            ...prev,
            ...backendErrors,
            ...(Object.keys(backendErrors).length === 0 && data?.message
              ? { password: data.message }
              : {})
          }));
        }
      }
    }
  }

  async function handleEmailChange(value: string) {
    setFormData(prev => ({
      ...prev,
      email: value
    }));
    if (value.trim() && touched.email) {
      setErrors(prev => ({
        ...prev,
        email: ''
      }));
    }
  }

  async function handleEmailBlur() {
    setTouched(prev => ({
      ...prev,
      email: true
    }));

    if (!formData.email.trim()) {
      setErrors(prev => ({
        ...prev,
        email: 'Введите вашу электронную почту'
      }));
    }
  }

  async function handlePasswordChange(value: string) {
    setFormData(prev => ({
      ...prev,
      password: value
    }))
    if (value.trim() && touched.password) {
      setErrors(prev => ({
        ...prev,
        password: ''
      }));
    }
  }

  async function handlePasswordBlur() {
    setTouched(prev => ({
      ...prev,
      password: true
    }));
    if (!formData.password.trim()) {
      setErrors(prev => ({
        ...prev,
        password: 'Введите ваш пароль'
      }));
    }
  }

  async function handleCheckboxChange(checked: boolean) {
    setFormData(prev => ({
      ...prev,
      rememberMe: checked
    }))
  }

  return (
    <div className="loginPage">
      <div className="loginForm">
        <h2 className="loginFormTitle">Добро пожаловать</h2>
        <p className="loginFormDescription">Войдите в свою учетную запись</p>

        <form className="loginFormFields" onSubmit={handleLogin}>
          <InputRegisterForm
            title="Электронная почта"
            type="email"
            value={formData.email}
            placeholder="name@example.com"
            leftIcon={emailIcon}
            onChange={handleEmailChange}
            error={errors.email}
            onBlur={handleEmailBlur}
          />
          <InputRegisterForm
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
          <AuthButton
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