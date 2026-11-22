import "./TaskEditInputForm.css"
import { InputForm } from "../InputForm/InputForm";

type TaskEditInputFormProps = {
  title: string;
  type: string;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;

  leftIcon?: string;
  rightIcon?: string;
  rightIconActive?: string;
  disabled?: boolean;

  rightButtonText?: string;
  onRightButtonClick?: () => void;

  error?: string;
  onBlur?: () => void;
}

export function TaskEditInputForm({...props }: TaskEditInputFormProps) {
  return (
    <InputForm
      className="taskEditInputForm"
      title={props.title}
      type={props.type}
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
      leftIcon={props.leftIcon}
      rightIcon={props.rightIcon}
      rightIconActive={props.rightIconActive}
      disabled={props.disabled}
      rightButtonText={props.rightButtonText}
      onRightButtonClick={props.onRightButtonClick}
      error={props.error}
      onBlur={props.onBlur}
    />
  );
}