import { InventarioTipo } from "@/core/inventory/interfaces";

export const DEFAULT_SEDE = 1;

export const TIPO_FILTERS = [
  { label: "Todos", value: "ALL" },
  { label: "Suministros", value: "SUMINISTRO" },
  { label: "Inventario", value: "INVENTARIO" },
] as const;

export type TipoFilterValue = (typeof TIPO_FILTERS)[number]["value"];

export const TIPO_LABELS: Record<InventarioTipo, string> = {
  SUMINISTRO: "Suministro",
  INVENTARIO: "Inventario",
};
