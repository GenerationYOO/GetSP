import "./TaskEditTextArea.css"

type TaskEditTextAreaProps = {
  title: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

export function TaskEditTextArea({
  title,
  value,
  placeholder,
  onChange,
}: TaskEditTextAreaProps) {
  return (
    <div className="taskEditTextArea">
      <h3 className="taskEditTextAreaTitle">{title.toUpperCase()}</h3>
      <textarea
        className="taskEditTextAreaField"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}