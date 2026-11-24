import "./TaskPreviewBlock.css"
import "../../styles/taskPriority.css"
import "../../styles/taskPreviewActions.css"
import { TaskTags } from "../TaskTags/TaskTags"
import pencil from "../../assets/icons/pencil.svg"
import urn from "../../assets/icons/urn.svg"
import { getPriorityClassName } from "../../utils/taskPriority"

type TaskPreviewBlockProps = {
  id: string
  priority: string
  title: string
  description: string
  tags: string[]
  onClick?: () => void
}


export function TaskPreviewBlock({
  id,
  priority,
  title,
  description,
  tags,
  onClick
}: TaskPreviewBlockProps) {

  const translatedPriority = getPriorityClassName(priority)

  return (
    <div className="taskPreviewBlock" onClick={onClick}>
      <header className="taskPreviewBlockHeader">
        <span className="taskPreviewBlockId">{id}</span>
        <span className={`taskPreviewBlockPriority ${translatedPriority}`}>
          {priority}
        </span>
      </header>
      <main className="taskPreviewBlockMain">
        <h3 className="taskPreviewBlockTitle">{title}</h3>
        <p className="taskPreviewBlockDescription">{description}</p>
      </main>
      <footer className="taskPreviewBlockFooter">
        <TaskTags
          tags={tags}
        />
        <span className="taskPreviewBlockDivider"></span>
        <div className="taskPreviewActions">
          <button className="taskPreviewActionButton">
            <img src={pencil} alt="Edit" />
          </button>
          <button className="taskPreviewActionButton">
            <img src={urn} alt="Delete" />
          </button>
        </div>
      </footer>
    </div>
  )
}