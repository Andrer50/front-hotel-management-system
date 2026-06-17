import { apiClient } from "@/lib/http-client";
import {
  Guest,
  CreateGuestRequest,
  UpdateGuestRequest,
  GuestSelectData,
} from "../interfaces";

export const getGuestsAction = async (): Promise<Guest[]> => {
  return apiClient.get<Guest[]>("hotel/huespedes");
};

export const getGuestSelectDataAction = async (): Promise<GuestSelectData> => {
  return apiClient.get<GuestSelectData>("hotel/select-data");
};

export const createGuestAction = async (
  request: CreateGuestRequest,
): Promise<Guest> => {
  return apiClient.post<Guest>("hotel/huespedes", request);
};

export const updateGuestAction = async (
  request: UpdateGuestRequest,
): Promise<Guest> => {
  const { id, ...data } = request;
  return apiClient.patch<Guest>(`hotel/huespedes/${id}`, data);
};

export const deleteGuestAction = async (id: number): Promise<void> => {
  return apiClient.delete<void>(`hotel/huespedes/${id}`);
};
