type TaskPriority = | "Обычная"
  | "Неотложная"
  | "Критическая"
  | "Серьезная"
  | "Незначительная"

const priorityMap: Record<TaskPriority, string> = {
  "Обычная": "Normal",
  "Неотложная": "Urgent",
  "Критическая": "Critical",
  "Серьезная": "Major",
  "Незначительная": "Minor"
}

const priorityLabels: Record<number, TaskPriority> = {
  0: "Обычная",
  1: "Неотложная",
  2: "Критическая",
  3: "Серьезная",
  4: "Незначительная",
};

export function getPriorityClassName(priority: string): string {
  return priorityMap[priority as TaskPriority] || "Unknown";
}

export function getPriorityLabel(priority: number): string {
  return priorityLabels[priority] ?? "Неизвестная";
}