import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRoleAction } from "@/core/role/actions/roleActions";
import { UpdateRoleRequest, Role } from "@/core/role/interfaces";

export const useUpdateRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRoleRequest) => updateRoleAction(data),
    onSuccess: (updatedRole) => {
      // Actualización manual del caché para evitar el flicker
      queryClient.setQueryData(["roles"], (oldRoles: Role[] | undefined) => {
        if (!oldRoles) return [updatedRole];
        return oldRoles.map((role) =>
          role.id === updatedRole.id ? updatedRole : role
        );
      });
      
      // Invalidar para asegurar sincronización final
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
