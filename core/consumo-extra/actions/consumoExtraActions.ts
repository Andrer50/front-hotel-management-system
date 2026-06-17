import { apiClient } from "@/lib/http-client";
import { ConsumoExtra, CreateConsumoExtraRequest } from "../interfaces";

export const getConsumosExtraAction = async (
  reservaId: number,
): Promise<ConsumoExtra[]> =>
  apiClient.get<ConsumoExtra[]>(`hotel/consumos-extra?reserva_id=${reservaId}`);

export const createConsumoExtraAction = async (
  data: CreateConsumoExtraRequest,
): Promise<ConsumoExtra> =>
  apiClient.post<ConsumoExtra>("hotel/consumos-extra", data);
