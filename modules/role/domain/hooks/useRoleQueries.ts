import { useQuery } from "@tanstack/react-query";
import { getRolesAction, getPermissionsAction } from "@/core/role/actions/roleActions";

export const useGetRolesQuery = (token?: string) => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () => getRolesAction(token!),
    enabled: !!token,
  });
};

export const useGetPermissionsQuery = (token?: string) => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: () => getPermissionsAction(token!),
    enabled: !!token,
  });
};
