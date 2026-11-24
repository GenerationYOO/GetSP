import type { ImportPreviewResponse } from "./createSessionForm";

export type TaskPreview = {
  id: string;
  priority: string;
  title: string;
  description: string;
  tags: string[];
}

export type TaskPreviewLocationState = {
  sessionName: string;
  data: ImportPreviewResponse;
};