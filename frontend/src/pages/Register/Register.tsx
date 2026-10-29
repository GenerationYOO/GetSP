import './Register.css'
import { InputRegisterForm } from '../../components/InputRegisterForm/InputRegisterForm'
import userIcon from '../../assets/icons/user1.svg'
import emailIcon from '../../assets/icons/envelope.svg'
import passwordIcon from '../../assets/icons/lock.svg'
import eyeIcon from '../../assets/icons/eye.svg'
import eyeSlashIcon from '../../assets/icons/eyeOff.svg'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { registerUser } from '../../api/register'
import { AuthButton } from '../../components/AuthButton/AuthButton'
import { AuthSwitch } from '../../components/AuthSwitch/AuthSwitch'

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
type RegisterFormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

function getPasswordError(password: string): string | undefined {
  if (!password) {
    return 'Введите ваш пароль';
  }

  if (password.length < 8) {
    return 'Минимальная длина пароля - 8';
  }

  return undefined;
}

function getConfirmPasswordError(
  password: string,
  confirmPassword: string
): string | undefined {
  if (!confirmPassword) {
    return 'Повторите ваш пароль';
  }

  if (password !== confirmPassword) {
    return 'Пароли не совпадают';
  }

  return undefined;
}

export function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<RegisterFormErrors>({});

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  })

  function validateForm() {
    const newErrors: RegisterFormErrors = {};
    const passwordError = getPasswordError(formData.password);
    const confirmPasswordError = getConfirmPasswordError(
      formData.password,
      formData.confirmPassword
    );

    if (passwordError) {
      newErrors.password = passwordError;
    }
    if (confirmPasswordError) {
      newErrors.confirmPassword = confirmPasswordError;
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Введите ваше имя';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Введите вашу электронную почту';
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      try {
        await registerUser(formData.name, formData.email, formData.password);
        navigate('/login');
      } catch (error) {
        console.error('Ошибка при регистрации:', error);
      }
    }
  }

  function handleNameChange(value: string) {
    setFormData(prev => ({ ...prev, name: value }));

    if (touched.name) {
      setErrors(prev => ({
        ...prev,
        name: value.trim() ? undefined : 'Введите ваше имя'
      }));
    }
  }

  function handleNameBlur() {
    setTouched(prev => ({ ...prev, name: true }));

    if (!formData.name.trim()) {
      setErrors(prev => ({ ...prev, name: 'Введите ваше имя' }));
    }
  }

  function handleEmailChange(value: string) {
    setFormData(prev => ({ ...prev, email: value }));

    if (touched.email) {
      setErrors(prev => ({
        ...prev,
        email: value.trim() ? undefined : 'Введите вашу электронную почту'
      }));
    }
  }

  function handleEmailBlur() {
    setTouched(prev => ({ ...prev, email: true }));

    if (!formData.email.trim()) {
      setErrors(prev => ({
        ...prev,
        email: 'Введите вашу электронную почту'
      }));
    }
  }

  function handlePasswordChange(value: string) {
    setFormData(prev => ({ ...prev, password: value }));

    if (touched.password || touched.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        password: touched.password ? getPasswordError(value) : prev.password,
        confirmPassword: touched.confirmPassword
          ? getConfirmPasswordError(value, formData.confirmPassword)
          : prev.confirmPassword
      }));
    }
  }

  function handlePasswordBlur() {
    setTouched(prev => ({ ...prev, password: true }));
    setErrors(prev => ({
      ...prev,
      password: getPasswordError(formData.password)
    }));
  }

  function handleConfirmPasswordChange(value: string) {
    setFormData(prev => ({ ...prev, confirmPassword: value }));

    if (touched.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: getConfirmPasswordError(formData.password, value)
      }));
    }
  }

  function handleConfirmPasswordBlur() {
    setTouched(prev => ({ ...prev, confirmPassword: true }));
    setErrors(prev => ({
      ...prev,
      confirmPassword: getConfirmPasswordError(
        formData.password,
        formData.confirmPassword
      )
    }));
  }

  return (
    <div className="registerPage">
      <div className="registerForm">
        <div className="projectLogo"></div>
        <h2 className="registerTitle">Регистрация</h2>
        <p className="registerDescription">Создание нового аккаунта</p>

        <form className="registerFormFields" onSubmit={handleRegister}>
          <InputRegisterForm
            title="Ваше имя"
            type="name"
            value={formData.name}
            placeholder="Иванов Иван"
            leftIcon={userIcon}
            onChange={handleNameChange}
            error={errors.name}
            onBlur={handleNameBlur}
          />
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
            value={formData.password}
            placeholder="• • • • • • • •"
            leftIcon={passwordIcon}
            rightIcon={eyeIcon}
            rightIconActive={eyeSlashIcon}
            onChange={handlePasswordChange}
            error={errors.password}
            onBlur={handlePasswordBlur}
          />
          <InputRegisterForm
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
          <AuthButton
            text="Зарегистрироваться"
          />
        </form>
        <div className="registerFooter">
          <p className="registerFooterDescription">Уже есть аккаунт?</p>
          <AuthSwitch
            text="Войти"
            onClick={() => navigate("/login")}
          />
        </div>
      </div>
    </div>
  )
}