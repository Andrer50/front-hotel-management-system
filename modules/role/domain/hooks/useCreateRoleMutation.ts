import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRoleAction, CreateRoleRequest } from "@/core/role/actions/roleActions";

export const useCreateRoleMutation = (token?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleRequest) => createRoleAction(token!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
