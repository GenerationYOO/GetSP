import "./TaskEditPriority.css";
import "../../../../../shared/styles/taskPriority.css";
import { getPriorityClassName } from "../../../../../shared/utils/taskPriority";

const priorities = [
  "Неотложная",
  "Критическая",
  "Серьезная",
  "Обычная",
  "Незначительная",
];

type TaskEditPriorityProps = {
  value: string;
  onChange: (priority: string) => void;
};

export function TaskEditPriority({
  value,
  onChange,
}: TaskEditPriorityProps) {
  return (
    <div className="taskEditPriority">
      <h3 className="taskEditPriorityTitle">ПРИОРИТЕТ</h3>

      <div className="taskEditPriorityButtons">
        {priorities.map((priority) => (
          <button
            key={priority}
            type="button"
            className={[
              "taskTablePriority",
              getPriorityClassName(priority),
              priority === value ? "selected" : "",
            ].join(" ")}
            onClick={() => onChange(priority)}
          >
            {priority}
          </button>
        ))}
      </div>
    </div>
  );
}