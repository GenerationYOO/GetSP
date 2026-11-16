import "./TaskPreview.css"
import { PageLayout } from "../../components/PageLayout/PageLayout"
import { SurfaceCard } from "../../components/SurfaceCard/SurfaceCard"
import { ActionButton } from "../../components/ActionButton/ActionButton"
import { TaskPreviewBlock } from "../../components/TaskPreviewBlock/TaskPreviewBlock"
import { TaskTable } from "../../components/TaskTable/TaskTable"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export type TaskPreview = {
  id: string;
  priority: string;
  title: string;
  description: string;
  tags: string[];
}

const mockTasks: TaskPreview[] = [
  {
    id: "#125",
    priority: "Критическая",
    title: "Замена логотипа",
    description: `Кратко задачи описанию выработки строки накленных.
              Кратко задачи описанию выработки строки накленных.
              Кратко задачи описанию выработки строки накленных.
              Кратко задачи описанию выработки строки накленных.
              Кратко задачи описанию выработки строки накленных.
              Кратко задачи описанию выработки строки накленных.
              Кратко задачи описанию выработки строки накленных.
              `,
    tags: ["#разработка", "#баг", "#дизайн"]
  },
  {
    id: "#125",
    priority: "Критическая",
    title: "Замена логотипа",
    description: "Кратко задачи описанию выработки строки накленных.",
    tags: ["#разработка", "#баг", "#дизайн", "#баг", "#дизайн", "#баг", "#дизайн"]
  },
  {
    id: "#127",
    priority: "Обычная",
    title: "Добавить фильтры задач",
    description: "Добавить фильтрацию задач по статусу и приоритету.",
    tags: ["#разработка", "#фильтры"],
  },
  {
    id: "#128",
    priority: "Неотложная",
    title: "Исправить загрузку файла",
    description: "Большие файлы не загружаются с первого раза.",
    tags: ["#баг", "#загрузка"],
  },
  {
    id: "#129",
    priority: "Серьезная",
    title: "Обновить страницу профиля",
    description: "Добавить редактирование личных данных пользователя.",
    tags: ["#профиль", "#дизайн"],
  },
  {
    id: "#130",
    priority: "Незначительная",
    title: "Изменить подписи кнопок",
    description: "Заменить старые подписи кнопок на более понятные.",
    tags: ["#тексты", "#интерфейс"],
  },
  {
    id: "#131",
    priority: "Обычная",
    title: "Добавить уведомления",
    description: "Показывать уведомление после успешного сохранения задачи.",
    tags: ["#уведомления", "#разработка"],
  },
  {
    id: "#132",
    priority: "Серьезная",
    title: "Оптимизировать список задач",
    description: "Ускорить отображение большого количества задач.",
    tags: ["#производительность", "#оптимизация"],
  },
  {
    id: "#133",
    priority: "Незначительная",
    title: "Обновить документацию",
    description: "Добавить описание новых возможностей проекта.",
    tags: ["#документация"],
  }
]

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
                className={`taskPreviewSwitcherButton ${viewMode === "cards" ? "isActive" : "isInactive"
                  }`}
                text="Карточки"
                onClick={() => setViewMode("cards")}
              />
              <ActionButton
                className={`taskPreviewSwitcherButton ${viewMode === "table" ? "isActive" : "isInactive"
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
              Загружено задач: 9
            </h3>
          </div>
        </header>
        <div className=
        {`taskPreviewContent ${viewMode === "cards" 
          ? "taskPreviewContentCards" : "taskPreviewContentTable"}`}>
          {viewMode === "cards" ? (
            <div className="cards">
              {mockTasks.map((task) => (
                <TaskPreviewBlock
                  key={task.id}
                  id={task.id}
                  priority={task.priority}
                  title={task.title}
                  description={task.description}
                  tags={task.tags}
                />
              ))}
            </div>
          ) : (
            <TaskTable 
              tasks={mockTasks}
            />
          )}

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