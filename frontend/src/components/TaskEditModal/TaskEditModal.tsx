import "./TaskEditModal.css";
import { SurfaceCard } from "../SurfaceCard/SurfaceCard";
import type { ImportedTask } from "../../api/importPreview"
import { ActionButton } from "../ActionButton/ActionButton";
import { TaskEditInputForm } from "../TaskEditInputForm/TaskEditInputForm";
import { TaskEditTextArea } from "../TaskEditTextArea/TaskEditTextArea";
import { TaskEditTag } from "../TaskEditTag/TaskEditTag";
import { TaskEditPriority } from "../TaskEditPriority/TaskEditPriority";
import { getPriorityLabel, getPriorityValue } from "../../utils/taskPriority";
import { useState } from "react";
import pencil from "../../assets/icons/pencil.svg"

type TaskEditModalProps = {
  task: ImportedTask;
  onClose: () => void;
  onSave: (task: ImportedTask) => void;
};

export function TaskEditModal({ task, onClose, onSave }: TaskEditModalProps) {
  const [draft, setDraft] = useState<ImportedTask>(task);
  const [tagInput, setTagInput] = useState("");

  function addTag() {
    const tag = tagInput.trim().replace(/^#/, "");

    if (!tag || draft.tags.includes(tag)) {
      return;
    }

    setDraft((current) => ({
      ...current,
      tags: [...current.tags, tag],
    }));

    setTagInput("");
  }

  return (
    <div
      className="taskEditModalOverlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}>
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
            onChange={(value) => (setDraft((prev) => ({ ...prev, title: value })))}
            leftIcon={pencil}
          />
          <TaskEditPriority
            value={getPriorityLabel(draft.priority)}
            onChange={(priority) =>
              setDraft((prev) => ({
                ...prev,
                priority: getPriorityValue(priority)
              }))
            }
          />
          <TaskEditTextArea
            title="Описание задачи"
            value={draft.description}
            placeholder="Введите описание"
            onChange={(value) => (setDraft((prev) => ({ ...prev, description: value })))}
          />
          <TaskEditTag
            title="Теги"
            tags={draft.tags}
            tagInput={tagInput}
            setTagInput={setTagInput}
            addTag={addTag}
            onRemoveTag={(index) =>
              setDraft((current) => ({
                ...current,
                tags: current.tags.filter((_, tagIndex) => tagIndex !== index),
              }))
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
            onClick={() => onSave(draft)}
          />
        </footer>
      </SurfaceCard>
    </div>
  );
}