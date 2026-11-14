import "./TaskPreview.css"
import { PageLayout } from "../../components/PageLayout/PageLayout"
import { SurfaceCard } from "../../components/SurfaceCard/SurfaceCard"
import { ActionButton } from "../../components/ActionButton/ActionButton"
import { TaskPreviewBlock } from "../../components/TaskPreviewBlock/TaskPreviewBlock"
import { useNavigate  } from "react-router-dom"
import { useState } from "react"

export function TaskPreview() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  return (
    <PageLayout>
      <SurfaceCard className="taskPreviewCard">
        <header className="taskPreviewHeader">
          <div className="taskPreviewSwitcher">
            <h3 className="taskPreviewSwitcherTitle">
              РЕЖИМ ОТОБРАЖЕНИЯ ЗАДАЧ
            </h3>
            <div className="taskPreviewSwitcherButtons">
              <ActionButton
                className={`taskPreviewSwitcherButton ${
                  viewMode === "cards" ? "isActive" : "isInactive"
                }`}
                text="Карточки"
                onClick={() => setViewMode("cards")}
              />
              <ActionButton 
                className={`taskPreviewSwitcherButton ${
                  viewMode === "table" ? "isActive" : "isInactive"
                }`}
                text="Таблица"
                onClick={() => setViewMode("table")}
              />
            </div>
          </div>
          <div className="taskPreviewHeaderTitle">
            <h2 className="taskPreviewHeaderTitleMain">
              Создание сессии
            </h2>
            <h3 className="taskPreviewHeaderTitleSub">
              Предпросмотр задач
            </h3>
          </div>
          <div className="taskPreviewHeaderTaskCount">
            <h3 className="taskPreviewHeaderTaskCountText">
              Загружено задач: 12
            </h3>
          </div>
        </header>
        <div className="taskPreviewContent">
          <div className="cards">
            <TaskPreviewBlock 
            id="#125"
            priority="Критическая"
            title="Замена логотипа"
            description="Кратко задачи описанию выработки строки накленных.
            Кратко задачи описанию выработки строки накленных.
            Кратко задачи описанию выработки строки накленных.
            Кратко задачи описанию выработки строки накленных.
            Кратко задачи описанию выработки строки накленных.
            Кратко задачи описанию выработки строки накленных.
            Кратко задачи описанию выработки строки накленных.
            "
            tags={["#разработка", "#баг", "#дизайн"]}
          />
          <TaskPreviewBlock 
            id="#125"
            priority="Критическая"
            title="Замена логотипа"
            description="Кратко задачи описанию выработки строки накленных."
            tags={["#разработка", "#баг", "#дизайн", "#баг", "#дизайн", "#баг", "#дизайн"]}
          />
          <TaskPreviewBlock 
            id="#125"
            priority="Обычная"
            title="Замена логотипа"
            description="Кратко задачи описанию выработки строки накленных."
            tags={["#разработка", "#баг", "#дизайн", "#баг", "#дизайн", "#баг", "#дизайн"]}
          />
          <TaskPreviewBlock 
            id="#125"
            priority="Неотложная"
            title="Замена логотипа"
            description="Кратко задачи описанию выработки строки накленных."
            tags={["#разработка", "#баг", "#дизайн", "#баг", "#дизайн", "#баг", "#дизайн"]}
          />
          <TaskPreviewBlock 
            id="#125"
            priority="Серьезная"
            title="Замена логотипа"
            description="Кратко задачи описанию выработки строки накленных."
            tags={["#разработка", "#баг", "#дизайн", "#баг", "#дизайн", "#баг", "#дизайн"]}
          />
          <TaskPreviewBlock 
            id="#125"
            priority="Незначительная"
            title="Замена логотипа"
            description="Кратко задачи описанию выработки строки накленных."
            tags={["#разработка", "#баг", "#дизайн", "#баг", "#дизайн", "#баг", "#дизайн"]}
          />
          </div> 
        </div>
        <footer className="taskPreviewFooter">
          <ActionButton
            className="taskPreviewFooterBackButton"
            text="Назад"
            onClick={() => navigate('../create-session')}
          />
          <ActionButton
            className="taskPreviewFooterStartButton"
            text="Начать сессию"
          />
        </footer>
      </SurfaceCard>
    </PageLayout>
  )
}