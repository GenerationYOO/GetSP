import { api } from "./axios";

export type ImportedTask = {
  externalId: string;
  title: string;
  project: string;
  tags: string[];
  reporter: string;
  createdAtSource: string;
  updatedAtSource: string;
  isCompleted: boolean;
  priority: number;
  type: string;
  state: string;
  assignee: string;
  originalEstimation: number | null;
  storyPoints: number | null;
  sprints: string;
  idealDays: number | null;
  description: string;
  votes: number;
  order: number;
}

export type ImportPreviewResponse = {
  importId: string;
  tasks: ImportedTask[];
  warnings: string[];
}

export async function previewImport(
  file: File
): Promise<ImportPreviewResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post<ImportPreviewResponse>(
    "/import/preview",
    formData
  );

  return data;
}