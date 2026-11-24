import { api } from "../../../shared/api/api";
import type { ImportPreviewResponse } from "../models/createSessionForm";

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