import { useQuery } from "@tanstack/react-query";
import { getTemporadasAction } from "@/core/temporada/actions/temporadaActions";
import { Temporada } from "@/core/temporada/interfaces";

export const useGetTemporadasQuery = () => {
  return useQuery<Temporada[]>({
    queryKey: ["temporadas"],
    queryFn: getTemporadasAction,
  });
};
