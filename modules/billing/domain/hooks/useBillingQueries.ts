import { useQuery } from "@tanstack/react-query";
import {
  getComprobanteByReservationAction,
  getComprobantesAction,
} from "@/core/billing/actions/billingActions";
import { Comprobante } from "@/core/billing/interfaces";

export const useGetComprobanteQuery = (reservaId: number) => {
  return useQuery<Comprobante | null>({
    queryKey: ["comprobante", reservaId],
    queryFn: () => getComprobanteByReservationAction(reservaId),
    enabled: !!reservaId,
  });
};

export const useGetComprobantesQuery = () => {
  return useQuery<Comprobante[]>({
    queryKey: ["comprobantes"],
    queryFn: getComprobantesAction,
  });
};
