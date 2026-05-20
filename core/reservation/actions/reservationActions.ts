import { apiClient } from "@/lib/http-client";

// ================================================================
// TIPOS
// ================================================================

export interface Reservation {
  id: number;
  codigo_reserva: string;
  huesped: number;
  huesped_nombre: string;
  huesped_documento: string;
  habitacion: number;
  habitacion_numero: string;
  fecha_entrada: string;
  fecha_salida: string;
  fecha_reserva: string;
  estado: "PENDIENTE" | "CONFIRMADA" | "EN_CURSO" | "COMPLETADA" | "CANCELADA";
  estado_display: string;
  tarifa_aplicada: number;
  origen: "DIRECTO" | "BOOKING" | "EXPEDIA" | "AIRBNB";
  origen_display: string;
  noches: number;
  total: number;
}

export interface CreateReservationRequest {
  huesped: number;
  habitacion: number;
  fecha_entrada: string;
  fecha_salida: string;
  tarifa_aplicada: number;
  origen: string;
}

export interface UpdateReservationRequest {
  estado?: string;
  tarifa_aplicada?: number;
}

// ================================================================
// ACTIONS
// ================================================================

export const getReservationsAction = async (): Promise<Reservation[]> => {
  return apiClient.get("hotel/reservas");
};

export const getStatsAction = async (): Promise<any> => {
  return apiClient.get("hotel/dashboard/stats");
};

export const createReservationAction = async (data: CreateReservationRequest): Promise<Reservation> => {
  return apiClient.post("hotel/reservas", data);
};

export const updateReservationAction = async (id: number, data: UpdateReservationRequest): Promise<Reservation> => {
  return apiClient.patch(`hotel/reservas/${id}`, data);
};

export const deleteReservationAction = async (id: number): Promise<void> => {
  return apiClient.delete(`hotel/reservas/${id}`);
};