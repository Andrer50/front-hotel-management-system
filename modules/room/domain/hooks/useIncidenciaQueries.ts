import { useQuery } from "@tanstack/react-query";
import { getIncidenciasAction } from "@/core/room/actions/incidenciaActions";

export const useGetIncidenciasQuery = () => {
    return useQuery({
        queryKey: ["incidencias"],
        queryFn: getIncidenciasAction,
        refetchInterval: 60000,
    });
};