import { useGetUsersQuery } from "@/modules/user/domain/hooks/useUserQueries";
import { useQuery } from "@tanstack/react-query";
import {
  getIncidenciasAction,
} from "@/core/incidencia/actions/incidenciaActions";
import { useMemo } from "react";

export const useGetIncidenciasQuery = () =>
  useQuery({
    queryKey: ["incidencias"],
    queryFn: () => getIncidenciasAction(),
    refetchInterval: 60000,
  });

export const useGetIncidenciasConResueltasQuery = (enabled = true) =>
  useQuery({
    queryKey: ["incidencias-todas"],
    queryFn: () => getIncidenciasAction(true),
    refetchInterval: 60000,
    enabled,
  });

export const useGetPersonalMantenimientoQuery = () => {
  const { data: users = [], ...rest } = useGetUsersQuery();

  const filtered = useMemo(() => {
    return users.filter((user) => user.role_details?.name === "Mantenimiento");
  }, [users]);

  return {
    ...rest,
    data: filtered,
  };
};
