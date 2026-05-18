import { apiClient } from "@/lib/http-client";
import { Incidencia, CreateIncidenciaRequest, PersonalLimpieza } from "../interfaces";

export const getIncidenciasAction = async (includeResueltas = false): Promise<Incidencia[]> =>
    apiClient.get<Incidencia[]>(`hotel/incidencias${includeResueltas ? '?include_resueltas=true' : ''}`);

export const createIncidenciaAction = async (data: CreateIncidenciaRequest): Promise<Incidencia> =>
    apiClient.post<Incidencia>("hotel/incidencias", data);

export const updateIncidenciaAction = async (
    id: number,
    data: Partial<{ estado: string; asignado_a: number | null; prioridad: string }>
): Promise<Incidencia> =>
    apiClient.patch<Incidencia>(`hotel/incidencias/${id}`, data);

export const deleteIncidenciaAction = async (id: number): Promise<void> =>
    apiClient.delete<void>(`hotel/incidencias/${id}`);

export const getPersonalMantenimientoAction = async (): Promise<PersonalLimpieza[]> =>
    apiClient.get<PersonalLimpieza[]>("hotel/personal-mantenimiento");