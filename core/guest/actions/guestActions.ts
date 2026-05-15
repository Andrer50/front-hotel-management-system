import { apiClient } from "@/lib/http-client";
import { Guest, CreateGuestRequest, UpdateGuestRequest } from "../interfaces";

export const getGuestsAction = async (): Promise<Guest[]> => {
  return apiClient.get<Guest[]>("hotel/huespedes");
};

export const createGuestAction = async (request: CreateGuestRequest): Promise<void> => {
  return apiClient.post<void>("hotel/huespedes", request);
};

export const updateGuestAction = async (request: UpdateGuestRequest): Promise<Guest> => {
  const { id, ...data } = request;
  return apiClient.patch<Guest>(`hotel/huespedes/${id}`, data);
};

export const deleteGuestAction = async (id: number): Promise<void> => {
  return apiClient.delete<void>(`hotel/huespedes/${id}`);
};
