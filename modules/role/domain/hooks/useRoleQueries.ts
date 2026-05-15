import { useQuery } from "@tanstack/react-query";
import {
  getRolesAction,
  getPermissionsAction,
} from "@/core/role/actions/roleActions";

export const useGetRolesQuery = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () => getRolesAction(),
  });
};

export const useGetPermissionsQuery = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: () => getPermissionsAction(),
  });
};
