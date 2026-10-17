import './Register.css'
import { InputRegisterForm } from '../../components/InputRegisterForm/InputRegisterForm'
import userIcon from '../../assets/icons/user1.svg'
import emailIcon from '../../assets/icons/envelope.svg'
import passwordIcon from '../../assets/icons/lock.svg'
import eyeIcon from '../../assets/icons/eye.svg'
import eyeSlashIcon from '../../assets/icons/eyeOff.svg'
import { useNavigate } from 'react-router-dom'


export function Register() {
  const navigate = useNavigate()
  return (
    <div className="registerPage">
      <div className="registerForm">
        <div className="projectLogo"></div>
        <h2 className="registerTitle">Регистрация</h2>
        <p className="registerDescription">Создание нового аккаунта</p>

        <form className="registerFormFields">
          <InputRegisterForm
            title="Ваше имя"
            type="text"
            placeholder="Иванов Иван"
            leftIcon={userIcon}
          />
          <InputRegisterForm
            title="Электронная почта"
            type="email"
            placeholder="name@example.com"
            leftIcon={emailIcon}
          />
          <InputRegisterForm
            title="Пароль"
            type="password"
            placeholder="• • • • • • • •"
            leftIcon={passwordIcon}
            rightIcon={eyeIcon}
            rightIconActive={eyeSlashIcon}
          />
          <InputRegisterForm
            title="Повторите пароль"
            type="password"
            placeholder="• • • • • • • •"
            leftIcon={passwordIcon}
            rightIcon={eyeIcon}
            rightIconActive={eyeSlashIcon}
            description='Минимальная длина пароля - 8'
          />
          <button className="registerButton">Зарегистрироваться</button>
        </form>
        <div className="registerFooter">
          <p>Уже есть аккаунт?</p>
          <button onClick={() => navigate("/login")} className="registerFooterButton">
            Войти
          </button>
        </div>
      </div>
    </div>
  )
}