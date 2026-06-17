import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComprobanteAction } from "@/core/billing/actions/billingActions";
import { CreateComprobanteRequest } from "@/core/billing/interfaces";
import { toast } from "sonner";

export const useCreateComprobanteMutation = (reservaId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateComprobanteRequest) =>
      createComprobanteAction(data),
    onSuccess: () => {
      // Invalidate comprobante queries
      queryClient.invalidateQueries({
        queryKey: ["comprobante", reservaId],
      });
      // Invalidate reservations and stats to reflect check-out status
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Comprobante emitido con éxito");
    },
    onError: (error) => {
      toast.error(error.message || "Error al emitir el comprobante");
    },
  });
};
