import "./TaskEditTag.css"

type TaskEditTagProps = {
  title: string;
  tags: string[];
  tagInput: string;
  setTagInput: (value: string) => void;
  addTag: () => void;
  onRemoveTag: (index: number) => void;
};

export function TaskEditTag({
  title,
  tags,
  tagInput,
  setTagInput,
  addTag,
  onRemoveTag,
}: TaskEditTagProps) {
  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    event.currentTarget.scrollLeft += event.deltaY * 0.5;
  }

  return (
    <div className="taskEditTags">
      <h3 className="taskEditTagsFieldTitle">{title.toUpperCase()}</h3>
      <div className="taskEditTagsField"
        onWheel={handleWheel}>
        {tags.map((tag, index) => (
          <span className="taskEditTag" key={`${tag}-${index}`}>
            {tag}

            <button
              type="button"
              className="taskEditTagRemove"
              aria-label={`Удалить тег ${tag}`}
              onClick={() => onRemoveTag(index)}
            >
              ×
            </button>
          </span>
        ))}

        <input
          className="taskEditTagsInput"
          value={tagInput}
          placeholder={tags.length ? "Добавить тег..." : "Добавьте тег"}
          onChange={(event) => setTagInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              addTag();
            }
          }}
        />
      </div>
    </div>
  );
}