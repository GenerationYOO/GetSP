import "./TaskPreviewWorkspace.css";
import { TaskPreviewBlock } from "../../../../shared/components/TaskPreviewBlock/TaskPreviewBlock";
import { TaskTable } from "../../../../shared/components/TaskTable/TaskTable";
import { ActionButton } from "../../../../shared/components/ActionButton/ActionButton";
import { getPriorityLabel } from "../../../../shared/utils/taskPriority";
import { TaskEditModal } from "../../../../shared/components/TaskEditModal/TaskEditModal";
import { useTaskPreview } from "../../hooks/useTaskPreview";

export function TaskPreviewWorkspace() {
  const {
    viewMode,
    state,
    sessionName,
    selectedTask,
    data,
    switchViewMode,
    openTask,
    closeTask,
    saveTask,
    goBack
  } = useTaskPreview();

  if (!state) {
    return (
      <p>Ошибка: Нет данных для предпросмотра задач.</p>
    );
  }

  return (
    <div className="taskPreviewWorkspace">
      <header className="taskPreviewHeader">
        <div className="taskPreviewSwitcher">
          <h3 className="taskPreviewSwitcherTitle">
            РЕЖИМ ОТОБРАЖЕНИЯ ЗАДАЧ
          </h3>
          <div className="taskPreviewSwitcherButtons">
            <ActionButton
              type="button"
              className={`taskPreviewSwitcherButton
                 ${viewMode === "cards" ? "isActive" : "isInactive"}`}
              text="Карточки"
              onClick={() => switchViewMode("cards")}
            />
            <ActionButton
              type="button"
              className={`taskPreviewSwitcherButton 
                ${viewMode === "table" ? "isActive" : "isInactive"}`}
              text="Таблица"
              onClick={() => switchViewMode("table")}
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
                onClick={() => openTask(task)}
                id={task.externalId}
                priority={getPriorityLabel(task.priority)}
                title={task.title.slice(0, 40)
                   + (task.title.length > 40 ? "..." : "")}
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
              title: task.title.slice(0, 40)
               + (task.title.length > 40 ? "..." : ""),
              description: task.description,
              tags: task.tags
            }))}
            onTaskClick={(task) => {
              const originalTask = data.tasks.find((item) =>
                item.externalId === task.id
              );

              if (originalTask) {
                openTask(originalTask);
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
          onClick={() => goBack()}
        />
        <ActionButton
          type="button"
          className="taskPreviewFooterStartButton"
          text="Начать сессию"
        />
      </footer>
      {selectedTask && (
        <TaskEditModal
          task={selectedTask}
          onClose={() => closeTask()}
          onSave={(updatedTask) => saveTask(updatedTask)}
        />
      )}
    </div>
  );
}