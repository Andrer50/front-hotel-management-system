import { useQuery } from "@tanstack/react-query";
import {
  getInventariosAction,
  getInventarioByIdAction,
} from "@/core/inventory/actions/inventarioActions";
import { Inventario, InventarioFilters } from "@/core/inventory/interfaces";

export const useGetInventariosQuery = (filters?: InventarioFilters) => {
  return useQuery<Inventario[]>({
    queryKey: ["inventarios", filters],
    queryFn: () => getInventariosAction(filters),
  });
};

export const useGetInventariosBajoStockQuery = () => {
  return useQuery<Inventario[]>({
    queryKey: ["inventarios-bajo-stock"],
    queryFn: () => getInventariosAction({ bajo_stock: true }),
  });
};

export const useGetInventarioByIdQuery = (id: number) => {
  return useQuery<Inventario>({
    queryKey: ["inventario", id],
    queryFn: () => getInventarioByIdAction(id),
    enabled: !!id,
  });
};
