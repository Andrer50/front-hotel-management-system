import { useQuery } from "@tanstack/react-query";
import { getUsersAction } from "@/core/user/actions/userActions";

export const useGetUsersQuery = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getUsersAction(),
  });
};
