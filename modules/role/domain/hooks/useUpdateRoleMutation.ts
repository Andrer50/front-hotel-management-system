import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRoleAction } from "@/core/role/actions/roleActions";
import { UpdateRoleRequest } from "@/core/role/interfaces";

export const useUpdateRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRoleRequest) => updateRoleAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
