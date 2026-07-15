import { apiClient } from "@/lib/http-client";
import { Temporada } from "../interfaces/index";

export const getTemporadasAction = async (): Promise<any> => {
  return apiClient.get("hotel/temporadas/");
};

export const createTemporadaAction = async (data: Partial<Temporada>): Promise<any> => {
  return apiClient.post("hotel/temporadas/", data);
};

export const updateTemporadaAction = async (id: number, data: Partial<Temporada>): Promise<any> => {
  return apiClient.patch(`hotel/temporadas/${id}/`, data);
};

export const deleteTemporadaAction = async (id: number): Promise<void> => {
  return apiClient.delete(`hotel/temporadas/${id}/`);
};