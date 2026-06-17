import { apiClient } from "@/lib/http-client";
import {
  CreateReservationRequest,
  Reservation,
  ReservationStats,
  UpdateReservationRequest,
} from "../interfaces";

// ================================================================
// ACTIONS
// ================================================================

export const getReservationsAction = async (): Promise<Reservation[]> => {
  return apiClient.get("hotel/reservas");
};

export const getStatsAction = async (): Promise<ReservationStats> => {
  return apiClient.get("hotel/dashboard/stats");
};

export const createReservationAction = async (
  data: CreateReservationRequest,
): Promise<Reservation> => {
  return apiClient.post("hotel/reservas", data);
};

export const updateReservationAction = async (
  id: number,
  data: UpdateReservationRequest,
): Promise<Reservation> => {
  return apiClient.patch(`hotel/reservas/${id}`, data);
};

export const deleteReservationAction = async (id: number): Promise<void> => {
  return apiClient.delete(`hotel/reservas/${id}`);
};

export const getReservationByIdAction = async (id: number): Promise<Reservation> => {
  return apiClient.get(`hotel/reservas/${id}`);
};
