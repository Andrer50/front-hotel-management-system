import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRoleAction, UpdateRoleRequest } from "@/core/role/actions/roleActions";

export const useUpdateRoleMutation = (token?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRoleRequest) => updateRoleAction(token!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
