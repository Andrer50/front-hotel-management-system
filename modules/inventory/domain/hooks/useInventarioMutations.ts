import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createInventarioAction,
  updateInventarioAction,
  deleteInventarioAction,
} from "@/core/inventory/actions/inventarioActions";
import {
  CreateInventarioRequest,
  UpdateInventarioRequest,
} from "@/core/inventory/interfaces";
import { toast } from "sonner";

const invalidateInventarioQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  queryClient.invalidateQueries({ queryKey: ["inventarios"] });
  queryClient.invalidateQueries({ queryKey: ["inventarios-bajo-stock"] });
};

export const useCreateInventarioMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInventarioRequest) => createInventarioAction(data),
    onSuccess: () => {
      invalidateInventarioQueries(queryClient);
      toast.success("Artículo registrado en el inventario");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al registrar el artículo");
    },
  });
};

export const useUpdateInventarioMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateInventarioRequest }) =>
      updateInventarioAction(id, data),
    onSuccess: () => {
      invalidateInventarioQueries(queryClient);
      toast.success("Artículo actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar el artículo");
    },
  });
};

export const useDeleteInventarioMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteInventarioAction(id),
    onSuccess: () => {
      invalidateInventarioQueries(queryClient);
      toast.success("Artículo eliminado del inventario");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar el artículo");
    },
  });
};
