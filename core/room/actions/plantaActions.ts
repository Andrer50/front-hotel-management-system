import { apiClient } from "@/lib/http-client";
import { Planta } from "../interfaces";

export const getPlantasAction = async (): Promise<Planta[]> => {
  return apiClient.get<Planta[]>("hotel/plantas");
};

export const createPlantaAction = async (data: Omit<Planta, "id">): Promise<Planta> => {
  return apiClient.post<Planta>("hotel/plantas", data);
};
