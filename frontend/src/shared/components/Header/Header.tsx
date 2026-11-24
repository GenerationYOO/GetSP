import "./Header.css"
import { useNavigate }  from "react-router-dom"
import { ThemeToggle } from "../ThemeToggle/ThemeToggle"
import logo from "../../assets/icons/logo.svg"
import userIcon from "../../assets/icons/user1.svg"

export function Header() {
  const navigate = useNavigate()

  return (
    <header className="header">
      <div className="headerLogo">
        <img src={logo} alt="Logo" />
        <h1 className="headerLogoTitle">GetSP</h1>
      </div>
      <nav className="header__nav">
        <button className="header__nav__button" onClick={() => navigate("/")}>
          Сессии
        </button>
        <button className="header__nav__button" onClick={() => navigate("/")}>
          История
        </button>
        <button className="header__nav__button" onClick={() => navigate("/")}>
          Команды
        </button>
      </nav>
      <div className="headerRegisterLoginTheme">
        <button className="headerRegisterLoginTheme__buttonRegister" onClick={() => navigate("/register")}>
          Регистрация
        </button>
        <button className="headerRegisterLoginTheme__buttonLogin" onClick={() => navigate("/login")}>
          <img src={userIcon} alt="User" className="headerRegisterLoginTheme__buttonLogin__icon"/>
          Войти
        </button>
        <ThemeToggle /> 
      </div>
    </header>
  )
}