import "./TaskTable.css";
import { TaskTableRow } from "./TaskTableRow";
import type { TaskPreview } from "../../pages/TaskPreview/TaskPreview";

type TaskTableProps = {
  tasks: TaskPreview[];
};

export function TaskTable({ tasks }: TaskTableProps) {
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
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}