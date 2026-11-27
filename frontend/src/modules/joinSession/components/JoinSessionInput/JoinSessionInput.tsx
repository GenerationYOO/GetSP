import "./JoinSessionInput.css";
import { InputForm } from "../../../../shared/components/InputForm/InputForm";


type JoinSessionInputProps = {
  placeholder: string;
  leftIcon: string;
  title: string;
  type: string;
  onChange: (value: string) => void;
  error?: string;
}

export function JoinSessionInput({ 
  placeholder, 
  leftIcon, 
  title, type, onChange, error }: JoinSessionInputProps) {
  return (
    <InputForm className="joinSessionInput" 
      placeholder={placeholder}
      leftIcon={leftIcon}
      title={title}
      type={type}
      onChange={(value) => onChange(value)}
      error={error}
    />
  );
}