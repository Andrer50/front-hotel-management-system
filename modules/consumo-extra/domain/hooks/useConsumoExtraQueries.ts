import { useQuery } from "@tanstack/react-query";
import { getConsumosExtraAction } from "@/core/consumo-extra/actions/consumoExtraActions";
import { ConsumoExtra } from "@/core/consumo-extra/interfaces";

export const useGetConsumosExtraQuery = (reservaId: number) => {
  return useQuery<ConsumoExtra[]>({
    queryKey: ["consumos-extra", reservaId],
    queryFn: () => getConsumosExtraAction(reservaId),
    enabled: !!reservaId,
  });
};
