import { apiClient } from "@/lib/http-client";
import {
  Inventario,
  InventarioFilters,
  CreateInventarioRequest,
  UpdateInventarioRequest,
} from "../interfaces";

const buildQueryString = (filters?: InventarioFilters): string => {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.tipo) params.append("tipo", filters.tipo);
  if (filters.bajo_stock) params.append("bajo_stock", "true");
  const query = params.toString();
  return query ? `?${query}` : "";
};

export const getInventariosAction = async (
  filters?: InventarioFilters,
): Promise<Inventario[]> =>
  apiClient.get<Inventario[]>(`hotel/inventarios${buildQueryString(filters)}`);

export const getInventarioByIdAction = async (id: number): Promise<Inventario> =>
  apiClient.get<Inventario>(`hotel/inventarios/${id}`);

export const createInventarioAction = async (
  data: CreateInventarioRequest,
): Promise<Inventario> => apiClient.post<Inventario>("hotel/inventarios", data);

export const updateInventarioAction = async (
  id: number,
  data: UpdateInventarioRequest,
): Promise<Inventario> =>
  apiClient.patch<Inventario>(`hotel/inventarios/${id}`, data);

export const deleteInventarioAction = async (id: number): Promise<void> =>
  apiClient.delete<void>(`hotel/inventarios/${id}`);
