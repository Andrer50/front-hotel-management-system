import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUserAction } from "@/core/user/actions/userActions";
import { CreateUserRequest } from "@/core/user/interfaces";

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => createUserAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
