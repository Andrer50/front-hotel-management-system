import { useQuery } from "@tanstack/react-query";
import { getLimpiezasAction, getPersonalLimpiezaAction } from "@/core/room/actions/limpiezaActions";

export const useGetLimpiezasQuery = () => {
    return useQuery({
        queryKey: ["limpiezas"],
        queryFn: getLimpiezasAction,
        refetchInterval: 30000,
    });
};

export const useGetPersonalLimpiezaQuery = () => {
    return useQuery({
        queryKey: ["personal-limpieza"],
        queryFn: getPersonalLimpiezaAction,
    });
};