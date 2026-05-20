import { apiClient } from "@/lib/http-client";
import {
  Incidencia,
  CreateIncidenciaRequest,
  UpdateIncidenciaRequest,
  PersonalMantenimiento,
} from "../interfaces";

export const getIncidenciasAction = async (
  includeResueltas = false,
): Promise<Incidencia[]> =>
  apiClient.get<Incidencia[]>(
    `hotel/incidencias${includeResueltas ? "?include_resueltas=true" : ""}`,
  );

export const getIncidenciaByIdAction = async (id: number): Promise<Incidencia> =>
  apiClient.get<Incidencia>(`hotel/incidencias/${id}`);

export const createIncidenciaAction = async (
  data: CreateIncidenciaRequest,
): Promise<Incidencia> => apiClient.post<Incidencia>("hotel/incidencias", data);

export const updateIncidenciaAction = async (
  id: number,
  data: UpdateIncidenciaRequest,
): Promise<Incidencia> => apiClient.patch<Incidencia>(`hotel/incidencias/${id}`, data);

export const deleteIncidenciaAction = async (id: number): Promise<void> =>
  apiClient.delete<void>(`hotel/incidencias/${id}`);

export const getPersonalMantenimientoAction = async (): Promise<
  PersonalMantenimiento[]
> => apiClient.get<PersonalMantenimiento[]>("hotel/personal-mantenimiento");
