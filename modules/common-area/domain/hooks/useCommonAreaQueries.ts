import { useQuery } from "@tanstack/react-query";
import { 
  getCommonAreasAction, 
  getCommonAreaByIdAction 
} from "@/core/common-area/actions/commonAreaActions";
import { CommonArea } from "@/core/common-area/interfaces";

export const useGetCommonAreasQuery = () => {
  return useQuery<CommonArea[]>({
    queryKey: ["common-areas"],
    queryFn: getCommonAreasAction,
  });
};

export const useGetCommonAreaByIdQuery = (id: number) => {
  return useQuery<CommonArea>({
    queryKey: ["common-area", id],
    queryFn: () => getCommonAreaByIdAction(id),
    enabled: !!id,
  });
};
