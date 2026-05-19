import { apiClient } from "@/lib/http-client";
import { RegistroLimpieza, CreateLimpiezaRequest, PersonalLimpieza } from "../interfaces";

export const getLimpiezasAction = async (): Promise<RegistroLimpieza[]> => {
    return apiClient.get<RegistroLimpieza[]>("hotel/limpiezas");
};

export const createLimpiezaAction = async (data: CreateLimpiezaRequest): Promise<RegistroLimpieza> => {
    return apiClient.post<RegistroLimpieza>("hotel/limpiezas", data);
};

export const getPersonalLimpiezaAction = async (): Promise<PersonalLimpieza[]> => {
    return apiClient.get<PersonalLimpieza[]>("hotel/personal-limpieza");
};

export const updateLimpiezaAction = async (
    id: number, 
    data: Partial<{ estado: string; personal_limpieza: number | null; observaciones: string }>
): Promise<RegistroLimpieza> => {
    return apiClient.patch<RegistroLimpieza>(`hotel/limpiezas/${id}`, data);
};

export const deleteLimpiezaAction = async (id: number): Promise<void> => {
    return apiClient.delete<void>(`hotel/limpiezas/${id}`);
};