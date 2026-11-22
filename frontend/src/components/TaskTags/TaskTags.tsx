import "./TaskTags.css";

type TaskTagsProps = {
  tags: string[];
  onRemove?: (index: number) => void;
};

export function TaskTags({ tags, onRemove }: TaskTagsProps) {
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
          {onRemove && (
            <button
              type="button"
              className="taskPreviewTagRemove"
              aria-label={`Удалить тег ${tag}`}
              onClick={() => onRemove(index)}
            >
              ×
            </button>
          )}
        </span>
      ))}
    </div>
  );
}