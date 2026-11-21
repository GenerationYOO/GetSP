import "./TaskTable.css";
import { TaskTableRow } from "./TaskTableRow";
import type { TaskPreview } from "../../pages/TaskPreview/TaskPreview";

type TaskTableProps = {
  tasks: TaskPreview[];
  onClick?: () => void;
};

export function TaskTable({ tasks, onClick }: TaskTableProps) {
  return (
    <div className="taskTableWrapper">
      <table className="taskTable">
        <colgroup>
          <col className="taskTableIdColumn" />
          <col className="taskTableTitleColumn" />
          <col className="taskTableDescriptionColumn" />
          <col className="taskTablePriorityColumn" />
          <col className="taskTableActionsColumn" />
        </colgroup>
        <thead>
          <tr className="taskTableHeader">
            <th>ID</th>
            <th>ЗАГОЛОВОК И ТЕГИ</th>
            <th>ОПИСАНИЕ</th>
            <th>ПРИОРИТЕТ</th>
            <th>ДЕЙСТВИЯ</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <TaskTableRow
              key={task.id}
              task={task}
              onClick={onClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}