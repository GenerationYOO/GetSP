import "./TaskPreviewBlock.css"
import pencil from "../../assets/icons/pencil.svg"
import urn from "../../assets/icons/urn.svg"

type TaskPreviewBlockProps = {
  id: string
  priority: string
  title: string
  description: string
  tags: string[]
}

type RussianPriority = | "Обычная"
  | "Неотложная"
  | "Критическая"
  | "Серьезная"
  | "Незначительная"

export function TaskPreviewBlock({
  id,
  priority,
  title,
  description,
  tags }
  : TaskPreviewBlockProps) {
  const priorityMap: Record<RussianPriority, string> = {
    "Обычная": "Normal",
    "Неотложная": "Urgent",
    "Критическая": "Critical",
    "Серьезная": "Major",
    "Незначительная": "Minor"
  }

  const translatedPriority = priorityMap[priority as RussianPriority]

  function handleTagsWheel(event: React.WheelEvent<HTMLDivElement>) {
    if (event.deltaY !== 0) {
      event.currentTarget.scrollLeft += event.deltaY * 0.5
      event.preventDefault()
    }
  }

  return (
    <div className="taskPreviewBlock">
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
        <div className="taskPreviewBlockTags" onWheel={handleTagsWheel}>
          {tags.map((tag, index) => (
            <span key={index} className="taskPreviewBlockTag">
              {tag}
            </span>
          ))}
        </div>
        <span className="taskPreviewBlockDivider"></span>
        <div className="taskPreviewBlockActions">
          <button className="taskPreviewBlockActionButton">
            <img src={pencil} alt="Edit" />
          </button>
          <button className="taskPreviewBlockActionButton">
            <img src={urn} alt="Delete" />
          </button>
        </div>
      </footer>
    </div>
  )
}