import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserAction } from "@/core/user/actions/userActions";
import { UpdateUserRequest, User } from "@/core/user/interfaces";

interface UseUpdateUserMutationOptions {
  onSuccess?: () => void;
}

export const useUpdateUserMutation = (options?: UseUpdateUserMutationOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => updateUserAction(data),
    onSuccess: async () => {
      // 1. Invalidamos las queries para refrescar la tabla
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      
      // 2. Ejecutamos el callback del componente (ej. cerrar el modal)
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
  });
};
