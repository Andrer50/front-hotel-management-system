import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUserAction } from "@/core/user/actions/userActions";
import { CreateUserRequest } from "@/core/user/interfaces";

interface UseCreateUserMutationOptions {
  onSuccess?: () => void;
}

export const useCreateUserMutation = (
  options?: UseCreateUserMutationOptions,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => createUserAction(data),
    onSuccess: async () => {
      // 1. Invalidamos las queries para refrescar la tabla
      await queryClient.invalidateQueries({ queryKey: ["users"] });

      // 2. Ejecutamos el callback del componente (ej. resetear formulario, cerrar modal)
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
  });
};
