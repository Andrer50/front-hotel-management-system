import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCommonAreaAction,
  updateCommonAreaAction,
  deleteCommonAreaAction,
} from "@/core/common-area/actions/commonAreaActions";
import { toast } from "sonner";

export const useCreateCommonAreaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCommonAreaAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["common-areas"] });
      toast.success("Área común creada correctamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al crear el área común");
    },
  });
};

export const useUpdateCommonAreaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCommonAreaAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["common-areas"] });
      toast.success("Área común actualizada correctamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar el área común");
    },
  });
};

export const useDeleteCommonAreaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCommonAreaAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["common-areas"] });
      toast.success("Área común eliminada correctamente");
    },
    onError: (error) => {
      toast.error(error.message || "Error al eliminar el área común");
    },
  });
};
