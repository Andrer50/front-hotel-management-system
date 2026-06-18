import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTemporadaAction,
  updateTemporadaAction,
  deleteTemporadaAction,
} from "@/core/temporada/actions/temporadaActions";
import {
  CreateTemporadaRequest,
  UpdateTemporadaRequest,
} from "@/core/temporada/interfaces";

export const useCreateTemporadaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTemporadaRequest) => createTemporadaAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["temporadas"] });
    },
  });
};

export const useUpdateTemporadaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTemporadaRequest }) =>
      updateTemporadaAction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["temporadas"] });
    },
  });
};

export const useDeleteTemporadaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTemporadaAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["temporadas"] });
    },
  });
};
