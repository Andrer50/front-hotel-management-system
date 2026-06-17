import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createConsumoExtraAction } from "@/core/consumo-extra/actions/consumoExtraActions";
import { CreateConsumoExtraRequest } from "@/core/consumo-extra/interfaces";
import { toast } from "sonner";

export const useCreateConsumoExtraMutation = (reservaId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateConsumoExtraRequest) =>
      createConsumoExtraAction(data),
    onSuccess: () => {
      // Invalida consumos
      queryClient.invalidateQueries({
        queryKey: ["consumos-extra", reservaId],
      });
      // Invalida inventarios para reflejar el descuento de stock
      queryClient.invalidateQueries({ queryKey: ["inventarios"] });
      queryClient.invalidateQueries({ queryKey: ["inventarios-bajo-stock"] });
      // Invalida reservaciones y estadísticas
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["reservation-stats"] });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Consumo extra registrado");
    },
    onError: (error) => {
      toast.error(error.message || "Error al registrar el consumo extra");
    },
  });
};
