import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRoleAction } from "@/core/role/actions/roleActions";
import { CreateRoleRequest } from "@/core/role/interfaces";

export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleRequest) => createRoleAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
