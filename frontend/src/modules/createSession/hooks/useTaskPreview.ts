import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { ImportPreviewResponse, ImportedTask } from "../models/createSessionForm";
import type { TaskPreviewLocationState } from "../models/taskPreview";


const PREVIEW_STORAGE_KEY = "getsp:task-preview";

export function useTaskPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const [state] = useState<TaskPreviewLocationState | null>(() => {
    if (location.state) {
      return location.state as TaskPreviewLocationState;
    }

    try {
      const saved = sessionStorage.getItem(PREVIEW_STORAGE_KEY);
      return saved
        ? JSON.parse(saved) as TaskPreviewLocationState
        : null;
    } catch (error) {
      console.error("Не удалось восстановить предпросмотр задач:", error);
      return null;
    }
  });
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [selectedTask, setSelectedTask] = useState<ImportedTask | null>(null);
  const [data, setData] = useState<ImportPreviewResponse>(
    state?.data ?? {
      importId: "",
      warnings: [],
      tasks: [],
    }
  );

  useEffect(() => {
    if (!state)
      return;

    try {
      sessionStorage.setItem(
        PREVIEW_STORAGE_KEY,
        JSON.stringify({ ...state, data })
      );
    } catch (error) {
      console.error("Не удалось сохранить предпросмотр задач:", error);
    }
  }, [state, data]);

  function switchViewMode(mode: "cards" | "table") {
    setViewMode(mode);
  }

  function openTask(task: ImportedTask) {
    setSelectedTask(task);
  }

  function closeTask() {
    setSelectedTask(null);
  }

  function saveTask(updatedTask: ImportedTask) {
    setData((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.externalId === updatedTask.externalId
          ? updatedTask
          : task
      ),
    }));

    setSelectedTask(null);
  }

  function goBack() {
    navigate("/create-session");
  }

  return {
    viewMode,
    state,
    sessionName: state?.sessionName ?? "",
    selectedTask,
    data,
    switchViewMode,
    openTask,
    closeTask,
    saveTask,
    goBack,
  };
}