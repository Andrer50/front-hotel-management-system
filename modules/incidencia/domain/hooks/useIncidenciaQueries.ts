import { useQuery } from "@tanstack/react-query";
import {
  getIncidenciasAction,
  getPersonalMantenimientoAction,
} from "@/core/incidencia/actions/incidenciaActions";

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

export const useGetPersonalMantenimientoQuery = () =>
  useQuery({
    queryKey: ["personal-mantenimiento"],
    queryFn: getPersonalMantenimientoAction,
  });
