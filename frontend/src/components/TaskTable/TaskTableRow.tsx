import "./TaskTableRow.css";
import "../../styles/taskPriority.css";
import "../../styles/taskPreviewActions.css";
import type { TaskPreview } from "../../pages/TaskPreview/TaskPreview";
import { TaskTags } from "../TaskTags/TaskTags"
import pencil from "../../assets/icons/pencil.svg"
import urn from "../../assets/icons/urn.svg"
import { getPriorityClassName } from "../../utils/taskPriority";

type TaskTableRowProps = {
  task: TaskPreview;
}

export function TaskTableRow({ task }: TaskTableRowProps) {
  const priorityClassName = getPriorityClassName(task.priority);
  return (
    <tr className="taskTableRow">
      <td className="taskTableId">{task.id}</td>
      <td>
        <div className="taskTableTitleAndTags">
          <span className="taskTableTitle">{task.title}</span>
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