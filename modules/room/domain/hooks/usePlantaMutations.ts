import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlantaAction } from "@/core/room/actions/plantaActions";

export const useCreatePlantaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlantaAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plantas"] });
    },
  });
};
