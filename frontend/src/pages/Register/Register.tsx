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
};

export function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const registerButtonDisabled = !formData.name 
      || !formData.email 
      || !formData.password 
      || !formData.confirmPassword;

  function validateForm() {
    const newErrors: RegisterFormErrors = {};
    if (formData.password !== formData.confirmPassword) {
      newErrors.password = 'Пароли не совпадают';
    }
    if (formData.password.length < 8) {
      newErrors.password = 'Минимальная длина пароля - 8';
    }
    if (!formData.password) {
      newErrors.password = 'Введите ваш пароль';
    }
    if (!formData.name) {
      newErrors.name = 'Введите ваше имя';
    }
    if (!formData.email) {
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
            placeholder="Иванов Иван"
            leftIcon={userIcon}
            onChange={(value) => setFormData(prev => ({
              ...prev,
              name: value
            }))}
            error={errors.name}
          />
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
          <InputRegisterForm
            title="Повторите пароль"
            type="password"
            placeholder="• • • • • • • •"
            leftIcon={passwordIcon}
            rightIcon={eyeIcon}
            rightIconActive={eyeSlashIcon}
            onChange={(value) => setFormData(prev => ({
              ...prev,
              confirmPassword: value
            }))}
            description='Минимальная длина пароля - 8'
          />
          <AuthButton
            disabled={registerButtonDisabled}
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