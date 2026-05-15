import { useQuery } from "@tanstack/react-query";
import { getPlantasAction } from "@/core/room/actions/plantaActions";

export const useGetPlantasQuery = () => {
  return useQuery({
    queryKey: ["plantas"],
    queryFn: getPlantasAction,
  });
};
