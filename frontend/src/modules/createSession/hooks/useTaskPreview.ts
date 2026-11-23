import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { ImportPreviewResponse, ImportedTask } from "../models/createSessionForm";
import type { TaskPreviewLocationState } from "../models/taskPreview";

export function useTaskPreview() {
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