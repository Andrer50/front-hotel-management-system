import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createIncidenciaAction,
  updateIncidenciaAction,
  deleteIncidenciaAction,
} from "@/core/incidencia/actions/incidenciaActions";
import {
  CreateIncidenciaRequest,
  UpdateIncidenciaRequest,
} from "@/core/incidencia/interfaces";

const invalidateIncidenciaQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: ["incidencias"] });
  queryClient.invalidateQueries({ queryKey: ["incidencias-todas"] });
  queryClient.invalidateQueries({ queryKey: ["rooms"] });
};

export const useCreateIncidenciaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateIncidenciaRequest) => createIncidenciaAction(data),
    onSuccess: () => invalidateIncidenciaQueries(queryClient),
  });
};

export const useUpdateIncidenciaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateIncidenciaRequest }) =>
      updateIncidenciaAction(id, data),
    onSuccess: () => invalidateIncidenciaQueries(queryClient),
  });
};

export const useDeleteIncidenciaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteIncidenciaAction(id),
    onSuccess: () => invalidateIncidenciaQueries(queryClient),
  });
};
