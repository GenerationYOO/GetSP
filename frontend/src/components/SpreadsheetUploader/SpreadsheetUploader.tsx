import "./SpreadsheetUploader.css";
import UploadSpreadsheetIcon from "../../assets/icons/document-upload.svg";
import { UploadButton } from "../UploadButton/UploadButton";
import type { DragEvent } from "react";
import { useState } from "react";

type SpreadsheetUploaderProps = {
  title: string;
  disabled?: boolean;
  onFileSelect: (file: File | null) => void;
  error?: string;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}
const allowedExtensions = [".xlsx", ".xls", ".csv"];

function isValidFileType(file: File): boolean {
  return allowedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
}

export function SpreadsheetUploader(props: SpreadsheetUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  function sectionClassName() {
    return `spreadsheetUploaderDropzone ${isDragging ? "isDragging" : ""}`;
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    if (props.disabled) {
      return;
    }

    handleFileSelect(event.dataTransfer.files[0] ?? null);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!props.disabled) {
      setIsDragging(true);
    }
  }

  function handleFileSelect(file: File | null) {
    if (!file || !isValidFileType(file)) {
      props.onFileSelect(null);
      return;
    }

    props.setSelectedFile(file);
    props.onFileSelect(file);
  }


  function getSelectedFileName() {
    return `${props.selectedFile!.name.slice(0, 16)}${props.selectedFile!.name.length > 16 ? "..." : ""}`;
  }
  return (
    <div className="spreadsheetUploader">
      <h3 className="spreadsheetUploaderTitle">
        {props.title.toUpperCase()}
      </h3>
      <section
        className={sectionClassName()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragging(false)}
      >
        <img
          className="spreadsheetUploaderIcon"
          src={UploadSpreadsheetIcon}
          alt="upload spreadsheet icon"
        />
        {props.selectedFile ? (
          <p className="spreadsheetUploaderDescription">
            Выбран файл: {getSelectedFileName()}
          </p>
        ) : props.error ? (
          <p className="spreadsheetUploaderError">{props.error}</p>
        ) : (
          <p className="spreadsheetUploaderDescription">
            Переместите сюда файл
          </p>
        )}
        <span className="spreadsheetUploaderFileTypes">
          excel / csv
        </span>
        <UploadButton className="spreadsheetUploaderButton"
          title="Выберите файл"
          disabled={props.disabled}
          onFileSelect={handleFileSelect}
        />
      </section>
    </div>
  )
}