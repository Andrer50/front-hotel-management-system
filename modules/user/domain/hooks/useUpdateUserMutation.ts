import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserAction } from "@/core/user/actions/userActions";
import { UpdateUserRequest } from "@/core/user/interfaces";

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => updateUserAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
