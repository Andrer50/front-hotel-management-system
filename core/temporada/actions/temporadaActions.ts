import { apiClient } from "@/lib/http-client";
import {
  Temporada,
  CreateTemporadaRequest,
  UpdateTemporadaRequest,
} from "../interfaces";

export const getTemporadasAction = async (): Promise<Temporada[]> => {
  return apiClient.get<Temporada[]>("hotel/temporadas");
};

export const createTemporadaAction = async (
  data: CreateTemporadaRequest,
): Promise<Temporada> => {
  return apiClient.post<Temporada>("hotel/temporadas", data);
};

export const updateTemporadaAction = async (
  id: number,
  data: UpdateTemporadaRequest,
): Promise<Temporada> => {
  return apiClient.put<Temporada>(`hotel/temporadas/${id}`, data);
};

export const deleteTemporadaAction = async (id: number): Promise<void> => {
  return apiClient.delete<void>(`hotel/temporadas/${id}`);
};
