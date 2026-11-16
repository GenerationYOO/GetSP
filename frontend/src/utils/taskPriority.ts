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

export function getPriorityClassName(priority: string): string {
  return priorityMap[priority as TaskPriority] || "Unknown";
}