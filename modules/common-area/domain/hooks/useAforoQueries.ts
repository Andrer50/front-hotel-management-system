import { useQuery } from "@tanstack/react-query";
import { getAforosAction } from "@/core/common-area/actions/aforoActions";

export const useGetAforosQuery = (areaId?: number) => {
    return useQuery({
        queryKey: ["aforos", areaId],
        queryFn: () => getAforosAction(areaId),
    });
};