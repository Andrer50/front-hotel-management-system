import { apiClient } from "@/lib/http-client";
import { Room, CreateRoomRequest, UpdateRoomRequest } from "../interfaces";

export const getRoomsAction = async (): Promise<Room[]> => {
  return apiClient.get<Room[]>("hotel/habitaciones");
};

export const createRoomAction = async (request: CreateRoomRequest): Promise<void> => {
  return apiClient.post<void>("hotel/habitaciones", request);
};

export const updateRoomAction = async (request: UpdateRoomRequest): Promise<Room> => {
  const { id, ...data } = request;
  return apiClient.patch<Room>(`hotel/habitaciones/${id}`, data);
};

export const deleteRoomAction = async (id: number): Promise<void> => {
  return apiClient.delete<void>(`hotel/habitaciones/${id}`);
};
