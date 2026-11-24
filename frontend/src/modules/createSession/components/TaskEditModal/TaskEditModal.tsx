import "./TaskEditModal.css";
import { SurfaceCard } from "../../../../shared/components/SurfaceCard/SurfaceCard";
import type { ImportedTask } from "../../models/createSessionForm";
import { ActionButton } from "../../../../shared/components/ActionButton/ActionButton";
import { TaskEditInputForm } from "./TaskEditInputForm/TaskEditInputForm";
import { TaskEditTextArea } from "./TaskEditTextArea/TaskEditTextArea";
import { TaskEditTag } from "./TaskEditTag/TaskEditTag";
import { TaskEditPriority } from "./TaskEditPriority/TaskEditPriority";
import { getPriorityLabel } from "../../../../shared/utils/taskPriority";
import pencil from "../../../../shared/assets/icons/pencil.svg";
import { useTaskEditModal } from "../../hooks/useTaskEditModal";

type TaskEditModalProps = {
  task: ImportedTask;
  onClose: () => void;
  onSave: (task: ImportedTask) => void;
};

export function TaskEditModal({ task, onClose, onSave }: TaskEditModalProps) {
  const {
    draft,
    tagInput,
    setTagInput,
    handleChangeTitle,
    handleChangeDescription,
    handleChangePriority,
    handleAddTag,
    handleRemoveTag,
    handleSave,
    handleOverlayClick
  } = useTaskEditModal(task, onClose, onSave);

  return (
    <div
      className="taskEditModalOverlay"
      onClick={(event) => handleOverlayClick(event)}>
      <SurfaceCard className="taskEditModalContent">
        <header className="taskEditModalHeader">
          <span className="taskEditModalTaskId">{task.externalId}</span>
          <h2 className="taskEditModalTitle">Редактирование задачи</h2>
          <button onClick={onClose} className="taskEditModalCloseButton" aria-label="Close modal">
            ×
          </button>
        </header>
        <div className="taskEditModalBody">
          <TaskEditInputForm
            title="Название задачи"
            type="text"
            placeholder="Введите название"
            value={draft.title}
            onChange={(value) => handleChangeTitle(value)}
            leftIcon={pencil}
          />
          <TaskEditPriority
            value={getPriorityLabel(draft.priority)}
            onChange={(priority) =>
              handleChangePriority(priority)
            }
          />
          <TaskEditTextArea
            title="Описание задачи"
            value={draft.description}
            placeholder="Введите описание"
            onChange={(value) => handleChangeDescription(value)}
          />
          <TaskEditTag
            title="Теги"
            tags={draft.tags}
            tagInput={tagInput}
            setTagInput={setTagInput}
            addTag={handleAddTag}
            onRemoveTag={(index) =>
              handleRemoveTag(index)
            }
          />
        </div>
        <footer className="taskEditModalFooter">
          <ActionButton
            type="button"
            className="taskEditModalFooterBackButton"
            text="Отмена"
            onClick={() => onClose()}
          />
          <ActionButton
            type="button"
            className="taskEditModalFooterStartButton"
            text="Сохранить изменения"
            onClick={() => handleSave()}
          />
        </footer>
      </SurfaceCard>
    </div>
  );
}