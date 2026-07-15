import { apiClient } from "@/lib/http-client";
import {
  Guest,
  CreateGuestRequest,
  UpdateGuestRequest,
  GuestSelectData,
} from "../interfaces";

// 🧠 NUEVO: Interfaz para el payload de la recomendación de IA
export interface PerfilHuespedPayload {
  edad: number | string;
  motivo_viaje: string;
  acompanantes: string;
  preferencias_comida: string;
  intereses: string;
}

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

// ==============================================================================
// 🚀 NUEVO: ACCIÓN DE GEMINI IA PARA RECOMENDACIÓN DE SERVICIOS
// ==============================================================================
export const obtenerRecomendacionesIAAction = async (
  payload: PerfilHuespedPayload
): Promise<any> => {
  // 🟢 Reemplaza el puerto de abajo (8000 o 8080) por el puerto real donde corre tu Django
  return apiClient.post<any>("http://localhost:8000/api/hotel/ia/recomendar-servicios/", payload);
};