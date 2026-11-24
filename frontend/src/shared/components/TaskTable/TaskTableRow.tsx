import "./TaskTableRow.css";
import "../../styles/taskPriority.css";
import "../../styles/taskPreviewActions.css";
import type { TaskTableRowData } from "./taskTable.types";
import { TaskTags } from "../TaskTags/TaskTags"
import pencil from "../../assets/icons/pencil.svg"
import urn from "../../assets/icons/urn.svg"
import { getPriorityClassName } from "../../utils/taskPriority";

type TaskTableRowProps = {
  task: TaskTableRowData;
  onTaskClick?: (task: TaskTableRowData) => void;
}

export function TaskTableRow({ task, onTaskClick }: TaskTableRowProps) {
  const priorityClassName = getPriorityClassName(task.priority);
  return (
    <tr className="taskTableRow" onClick={() => onTaskClick?.(task)}>
      <td className="taskTableId">{task.id}</td>
      <td>
        <div className="taskTableTitleAndTags">
          <p className="taskTableTitle">{task.title}</p>
          <TaskTags
            tags={task.tags}
          />
        </div>
      </td>
      <td>
        <div className="taskTableDescription">
          {task.description}
        </div>
      </td>
      <td className="taskTablePriorityCell">
        <span className={`taskTablePriority ${priorityClassName}`}>
          {task.priority}
        </span>
      </td>
      <td>
        <div className="taskPreviewActions">
          <button className="taskPreviewActionButton">
            <img src={pencil} alt="Edit" />
          </button>
          <button className="taskPreviewActionButton">
            <img src={urn} alt="Delete" />
          </button>
        </div>
      </td>
    </tr>
  );
}