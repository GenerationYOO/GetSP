import { useState } from "react";
import type { ImportedTask } from "../models/createSessionForm";
import { getPriorityValue } from "../../../shared/utils/taskPriority";

export function useTaskEditModal(
  task: ImportedTask,
  onClose: () => void,
  onSave: (task: ImportedTask) => void
) {
  const [draft, setDraft] = useState<ImportedTask>(task);
  const [tagInput, setTagInput] = useState("");

  function handleChangeTitle(title: string) {
    setDraft((prev) => ({ ...prev, title }));
  }

  function handleChangeDescription(description: string) {
    setDraft((prev) => ({ ...prev, description }));
  }

  function handleChangePriority(priority: string) {
    setDraft((prev) => ({
      ...prev,
      priority: getPriorityValue(priority)
    }));
  }

  function handleAddTag() {
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

  function handleRemoveTag(index: number) {
    setDraft((current) => ({
      ...current,
      tags: current.tags.filter((_, i) => i !== index),
    }));
  }

  function handleSave() {
    onSave(draft);
  }

  function handleOverlayClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return {
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
  };
}