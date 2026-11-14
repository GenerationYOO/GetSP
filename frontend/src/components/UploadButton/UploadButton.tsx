import "./UploadButton.css"
import { useRef } from "react";

type UploadButtonProps = {
  title: string;
  className?: string;
  disabled?: boolean;
  onFileSelect: (file: File | null) => void;
};

export function UploadButton({
  title,
  className = '',
  disabled,
  onFileSelect }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    onFileSelect(file);
  }

  return (
    <div>
      <input
        ref={inputRef}
        className="uploadButtonInput"
        type="file"
        accept=".xlsx,.xls,.csv"
        disabled={disabled}
        onChange={handleFileChange}
      />

      <button
        className={`uploadButton ${className}`}
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        {title}
      </button>
    </div>
  )
}