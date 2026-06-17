import { apiClient } from "@/lib/http-client";
import { Comprobante, CreateComprobanteRequest } from "../interfaces";

export const getComprobanteByReservationAction = async (
  reservaId: number,
): Promise<Comprobante | null> => {
  const list = await apiClient.get<Comprobante[]>(
    `hotel/comprobantes?reserva_id=${reservaId}`,
  );
  return list.length > 0 ? list[0] : null;
};

export const createComprobanteAction = async (
  data: CreateComprobanteRequest,
): Promise<Comprobante> => {
  return apiClient.post<Comprobante>("hotel/comprobantes", data);
};

export const getComprobantesAction = async (): Promise<Comprobante[]> => {
  return apiClient.get<Comprobante[]>("hotel/comprobantes");
};

export const downloadComprobantePDFAction = async (
  comprobanteId: number,
): Promise<Blob> => {
  return apiClient.get<Blob>(
    `hotel/comprobantes/${comprobanteId}/pdf`,
    { responseType: "blob" },
  );
};
