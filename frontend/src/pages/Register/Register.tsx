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
    if (formData.password !== formData.confirmPassword) {
      newErrors.password = 'Пароли не совпадают';
      newErrors.confirmPassword = 'Пароли не совпадают';
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
            value={formData.name}
            placeholder="Иванов Иван"
            leftIcon={userIcon}
            onChange={(value) => {
              setFormData(prev => ({
                ...prev,
                name: value
              }));
              if (touched.name && value.trim()) {
                setErrors(prev => ({
                  ...prev,
                  name: ''
                }));
              }
            }}
            error={errors.name}
            onBlur={() => {
              setTouched(prev => ({
                ...prev,
                name: true
              }));
              if (!formData.name.trim()) {
                setErrors(prev => ({
                  ...prev,
                  name: 'Введите ваше имя'
                }));
              }
            }
            }
          />
          <InputRegisterForm
            title="Электронная почта"
            type="email"
            value={formData.email}
            placeholder="name@example.com"
            leftIcon={emailIcon}
            onChange={(value) => {
              setFormData(prev => ({
                ...prev,
                email: value
              }));
              if (touched.email && value.trim()) {
                setErrors(prev => ({
                  ...prev,
                  email: ''
                }));
              }
            }}
            error={errors.email}
            onBlur={() => {
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
            }}
          />
          <InputRegisterForm
            title="Пароль"
            type="password"
            value={formData.password}
            placeholder="• • • • • • • •"
            leftIcon={passwordIcon}
            rightIcon={eyeIcon}
            rightIconActive={eyeSlashIcon}
            onChange={(value) => {
              setFormData(prev => ({
                ...prev,
                password: value
              }));
              if (touched.password && value.trim()) {
                setErrors(prev => ({
                  ...prev,
                  password: ''
                }));
              }
            }}
            error={errors.password}
            onBlur={() => {
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
            }}
          />
          <InputRegisterForm
            title="Повторите пароль"
            type="password"
            value={formData.confirmPassword}
            placeholder="• • • • • • • •"
            leftIcon={passwordIcon}
            rightIcon={eyeIcon}
            rightIconActive={eyeSlashIcon}
            onChange={(value) => {
              setFormData(prev => ({
                ...prev,
                confirmPassword: value
              }));
              if (touched.confirmPassword && value.trim()) {
                setErrors(prev => ({
                  ...prev,
                  password: '',
                  confirmPassword: ''
                }));
              }
            }}
            onBlur={() => {
              setTouched(prev => ({
                ...prev,
                confirmPassword: true
              }));
              if (!formData.confirmPassword.trim()) {
                setErrors(prev => ({
                  ...prev,
                  password: 'Повторите ваш пароль',
                  confirmPassword: 'Повторите ваш пароль'
                }));
              }
            }}
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