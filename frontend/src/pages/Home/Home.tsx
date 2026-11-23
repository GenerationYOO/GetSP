import "./Home.css";
import { PageLayout } from "../../shared/components/PageLayout/PageLayout";
import { Header } from "../../shared/components/Header/Header";
import { HomePageButton } from "../../shared/components/HomePageButton/HomePageButton";
import createSessionIcon from "../../shared/assets/icons/createSession.svg";
import joinSessionIcon from "../../shared/assets/icons/joiningSession.svg";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();
  return (
    <PageLayout>
      <Header />
      <div className="home-page">
        <div className="home-page__content">
          <div className="home-page__content__text-container">
            <p className="home-page__content__text">
              Agile Planning Poker для продуктовых команд
            </p>
          </div>
          <h1 className="home-page__content__title">
            Оценивайте задачи командой за
            <br />
            одним покерным столом
          </h1>
          <h3 className="home-page__content__subtitle">
            Загружайте бэклог из Excel, CSV или YouTrack, раздавайте карты и
            <br />
            приходите к единой оценке спринта без долгих споров.
          </h3>
          <div className="home-page__content__buttons">
            <HomePageButton
              leftIcon={createSessionIcon}
              title="Создать новую сессию"
              description="Откройте игровой стол, соберите колоду 
                задач и станьте крупье для своей команды"
              className="home-page__content__buttons__create-session-button"
              onClick={() => navigate("/create-session")}
            />
            <HomePageButton
              leftIcon={joinSessionIcon}
              title="Присоединиться к сессии"
              description="Займите место за столом по коду
                приглашения или вернитесь к
                недавним раздачам"
              className="home-page__content__buttons__join-session-button"
              onClick={() => navigate("/join-session")}
            />
          </div>
          <div className="home-page__content__description">
            <p className="home-page__content__description__text">
              Хотите сохранять историю игр и управлять составом команд?
            </p>
            <button
              className="home-page__content__description__button"
              onClick={() => navigate("/login")}>
              Войти в аккаунт
            </button>
            <span className="home-page__content__description__text">/</span>
            <button
              className="home-page__content__description__button"
              onClick={() => navigate("/register")}>
              Зарегистрироваться
            </button>
          </div>

        </div>
      </div>
    </PageLayout>
  )
}