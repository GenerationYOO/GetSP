import "./TaskTags.css";

type TaskTagsProps = {
  tags: string[];
}

export function TaskTags({ tags }: TaskTagsProps) {
  function handleTagsWheel(event: React.WheelEvent<HTMLDivElement>) {
    if (event.deltaY !== 0) {
      event.currentTarget.scrollLeft += event.deltaY * 0.5
      event.preventDefault()
    }
  }

  return (
    <div className="taskPreviewTags" onWheel={handleTagsWheel}>
      {tags.map((tag, index) => (
        <span key={index} className="taskPreviewTag">
          {tag}
        </span>
      ))}
    </div>
  );
}