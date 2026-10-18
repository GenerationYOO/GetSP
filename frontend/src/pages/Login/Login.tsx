import './Login.css'
import { InputRegisterForm } from '../../components/InputRegisterForm/InputRegisterForm'
import emailIcon from '../../assets/icons/envelope.svg'
import passwordIcon from '../../assets/icons/lock.svg'
import eyeIcon from '../../assets/icons/eye.svg'
import eyeSlashIcon from '../../assets/icons/eyeOff.svg'
import { Checkbox } from '../../components/Checkbox/Checkbox'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

type LoginFormData = {
  email: string;
  password: string;
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
  })
  const [errors, setErrors] = useState<LoginFormErrors>({});

  function validateForm() {
    if(!formData.email) {
      setErrors(prev => ({
        ...prev,
        email: 'Введите вашу электронную почту'
      }))
    }
    if(!formData.password) {
      setErrors(prev => ({
        ...prev,
        password: 'Введите ваш пароль'
      }))
    }
  }

  return (
    <div className="loginPage">
      <div className="loginForm">
        <h2 className="loginFormTitle">Добро пожаловать</h2>
        <p className="loginFormDescription">Войдите в свою учетную запись</p>

        <form className="loginFormFields">
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
            <Checkbox />
            <label htmlFor="checkbox">Запомнить меня</label>
          </div>
          <button
            type="button"
            className="loginButton"
            onClick={validateForm}>
              Войти</button>
        </form>
        <div className="loginFooter">
          <p className="loginFooterDescription">Еще нет аккаунта?</p>
          <button 
            className="loginFooterButton"
            onClick={() => navigate("/register")}
            >Регистрация</button>
        </div>
        
      </div>
    </div>
  )
}