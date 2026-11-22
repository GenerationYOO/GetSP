import "./TaskPreview.css"
import { PageLayout } from "../../components/PageLayout/PageLayout"
import { SurfaceCard } from "../../components/SurfaceCard/SurfaceCard"
import { ActionButton } from "../../components/ActionButton/ActionButton"
import { TaskPreviewBlock } from "../../components/TaskPreviewBlock/TaskPreviewBlock"
import { TaskTable } from "../../components/TaskTable/TaskTable"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useLocation } from "react-router-dom"
import { getPriorityLabel } from "../../utils/taskPriority"
import { TaskEditModal } from "../../components/TaskEditModal/TaskEditModal"
import type { ImportPreviewResponse } from "../../api/importPreview"
import type { ImportedTask } from "../../api/importPreview"

export type TaskPreview = {
  id: string;
  priority: string;
  title: string;
  description: string;
  tags: string[];
}

type TaskPreviewLocationState = {
  sessionName: string;
  data: ImportPreviewResponse;
};

export function TaskPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as TaskPreviewLocationState | null;
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [selectedTask, setSelectedTask] = useState<ImportedTask | null>(null);
  const [data, setData] = useState<ImportPreviewResponse>(
    state?.data ?? {
      importId: "",
      warnings: [],
      tasks: [],
    }
  );

  if (!state) {
    return <p>Данные предпросмотра не найдены</p>;
  }
  const { sessionName } = state;


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
                type="button"
                className={`taskPreviewSwitcherButton ${viewMode === "cards" ? "isActive" : "isInactive"
                  }`}
                text="Карточки"
                onClick={() => setViewMode("cards")}
              />
              <ActionButton
                type="button"
                className={`taskPreviewSwitcherButton ${viewMode === "table" ? "isActive" : "isInactive"
                  }`}
                text="Таблица"
                onClick={() => setViewMode("table")}
              />
            </div>
          </div>
          <div className="taskPreviewHeaderTitle">
            <h2 className="taskPreviewHeaderTitleMain">
              {sessionName.length > 20
                ? sessionName.slice(0, 20) + "..."
                : sessionName}
            </h2>
            <h3 className="taskPreviewHeaderTitleSub">
              Предпросмотр задач
            </h3>
          </div>
          <div className="taskPreviewHeaderTaskCount">
            <h3 className="taskPreviewHeaderTaskCountText">
              Загружено задач: {data.tasks.length}
            </h3>
          </div>
        </header>
        <div className=
          {`taskPreviewContent ${viewMode === "cards"
            ? "taskPreviewContentCards" : "taskPreviewContentTable"}`}>
          {viewMode === "cards" ? (
            <div className="cards">
              {data.tasks.map((task) => (
                <TaskPreviewBlock
                  key={task.externalId}
                  onClick={() => setSelectedTask(task)}
                  id={task.externalId}
                  priority={getPriorityLabel(task.priority)}
                  title={task.title.slice(0, 40) + (task.title.length > 40 ? "..." : "")}
                  description={task.description}
                  tags={task.tags}
                />
              ))}
            </div>
          ) : (
            <TaskTable
              tasks={data.tasks.map((task) => ({
                id: task.externalId,
                priority: getPriorityLabel(task.priority),
                title: task.title.slice(0, 40) + (task.title.length > 40 ? "..." : ""),
                description: task.description,
                tags: task.tags
              }))}
              onTaskClick={(task) => {
                const originalTask = data.tasks.find((item) =>
                  item.externalId === task.id
                );

                if (originalTask) {
                  setSelectedTask(originalTask);
                }
              }}
            />
          )}

        </div>
        <footer className="taskPreviewFooter">
          <ActionButton
            type="button"
            className="taskPreviewFooterBackButton"
            text="Назад"
            onClick={() => navigate('../create-session')}
          />
          <ActionButton
            type="button"
            className="taskPreviewFooterStartButton"
            text="Начать сессию"
          />
        </footer>
      </SurfaceCard>
      {selectedTask && (
        <TaskEditModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={(updatedTask) => {
            setData((current) => ({
              ...current,
              tasks: current.tasks.map((task) =>
                task.externalId === updatedTask.externalId
                  ? updatedTask
                  : task
              ),
            }));

            setSelectedTask(null);
          }}
        />
      )}

    </PageLayout>
  )
}