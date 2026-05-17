import { apiClient } from "@/lib/http-client";
import { Incidencia } from "../interfaces";

export const getIncidenciasAction = async (): Promise<Incidencia[]> => {
    return apiClient.get<Incidencia[]>("hotel/incidencias");
};