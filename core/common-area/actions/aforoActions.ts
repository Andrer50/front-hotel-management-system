import { apiClient } from "@/lib/http-client";
import { RegistroAforo, CreateAforoRequest, UpdateAforoRequest } from "../interfaces";

export const getAforosAction = async (areaId?: number): Promise<RegistroAforo[]> => {
    const url = areaId ? `hotel/aforos?area_comun=${areaId}` : "hotel/aforos";
    return apiClient.get<RegistroAforo[]>(url);
};

export const createAforoAction = async (data: CreateAforoRequest): Promise<RegistroAforo> => {
    return apiClient.post<RegistroAforo>("hotel/aforos", data);
};

export const updateAforoAction = async (data: UpdateAforoRequest): Promise<RegistroAforo> => {
    const { id, ...rest } = data;
    return apiClient.patch<RegistroAforo>(`hotel/aforos/${id}`, rest);
};

export const checkInAforoAction = async (id: number): Promise<RegistroAforo> => {
    return apiClient.post<RegistroAforo>(`hotel/aforos/${id}/checkin`);
};

export const checkOutAforoAction = async (id: number): Promise<RegistroAforo> => {
    return apiClient.post<RegistroAforo>(`hotel/aforos/${id}/checkout`);
};