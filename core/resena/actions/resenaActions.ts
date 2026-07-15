import { apiClient } from "@/lib/http-client";
import {
  Resena,
  Estadia,
  CreateResenaRequest,
  ResponderResenaRequest,
  ModerarResenaRequest,
} from "../interfaces";

export const getResenasAction = async (): Promise<Resena[]> => {
  return apiClient.get<Resena[]>("hotel/resenas");
};

export const getResenaPromedioAction = async (): Promise<{ promedio: number }> => {
  return apiClient.get<{ promedio: number }>("hotel/resenas/promedio");
};

export const createResenaAction = async (
  data: CreateResenaRequest,
): Promise<Resena> => {
  return apiClient.post<Resena>("hotel/resenas", data);
};

export const responderResenaAction = async (
  request: ResponderResenaRequest,
): Promise<Resena> => {
  const { id, respuesta_administrador } = request;
  return apiClient.patch<Resena>(`hotel/resenas/${id}/responder`, {
    respuesta_administrador,
  });
};

export const moderarResenaAction = async (
  request: ModerarResenaRequest,
): Promise<Resena> => {
  const { id, es_inapropiada } = request;
  return apiClient.patch<Resena>(`hotel/resenas/${id}/moderar`, {
    es_inapropiada,
  });
};
