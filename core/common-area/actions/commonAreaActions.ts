import { apiClient } from "@/lib/http-client";
import {
  CommonArea,
  CreateCommonAreaRequest,
  UpdateCommonAreaRequest,
} from "../interfaces";

export const getCommonAreasAction = async (): Promise<CommonArea[]> => {
  return apiClient.get<CommonArea[]>("hotel/areas-comunes");
};

export const getCommonAreaByIdAction = async (
  id: number,
): Promise<CommonArea> => {
  return apiClient.get<CommonArea>(`hotel/areas-comunes/${id}`);
};

export const createCommonAreaAction = async (
  request: CreateCommonAreaRequest,
): Promise<void> => {
  const formData = new FormData();
  Object.entries(request).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(
        key,
        typeof value === "number" ? value.toString() : (value as string | Blob),
      );
    }
  });

  return apiClient.post<void>("hotel/areas-comunes", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateCommonAreaAction = async (
  request: UpdateCommonAreaRequest,
): Promise<CommonArea> => {
  const { id, ...rest } = request;
  const formData = new FormData();

  Object.entries(rest).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      // Si es una imagen y no es un File (es decir, ya estaba cargada), no la enviamos
      if (key === "imagen" && !(value instanceof File)) return;
      formData.append(
        key,
        typeof value === "number" ? value.toString() : (value as string | Blob),
      );
    }
  });

  return apiClient.patch<CommonArea>(`hotel/areas-comunes/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteCommonAreaAction = async (id: number): Promise<void> => {
  return apiClient.delete<void>(`hotel/areas-comunes/${id}`);
};
