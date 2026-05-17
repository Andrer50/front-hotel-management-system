import { apiClient } from "@/lib/http-client";

export const getReservationsAction = async () => {
  return apiClient.get("hotel/reservas");
};

export const getStatsAction = async () => {
  return apiClient.get("hotel/dashboard/stats");
};

export const createReservationAction = async (data: any) => {
  return apiClient.post("hotel/reservas", data);
};

export const updateReservationAction = async (id: number, data: any) => {
  return apiClient.patch(`hotel/reservas/${id}`, data);
};

export const deleteReservationAction = async (id: number) => {
  return apiClient.delete(`hotel/reservas/${id}`);
};