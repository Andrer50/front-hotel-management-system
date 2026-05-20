import { CreateInventarioRequest } from "@/core/inventory/interfaces";

export interface InventarioFormErrors {
  nombre?: string;
  stock_actual?: string;
  stock_minimo?: string;
  precio_unitario?: string;
}

export function validateInventarioForm(
  data: Pick<
    CreateInventarioRequest,
    "nombre" | "stock_actual" | "stock_minimo" | "precio_unitario"
  >,
): InventarioFormErrors {
  const errors: InventarioFormErrors = {};

  if (!data.nombre.trim()) {
    errors.nombre = "El nombre es requerido";
  }
  if (data.stock_actual < 0) {
    errors.stock_actual = "El stock actual no puede ser negativo";
  }
  if (data.stock_minimo < 0) {
    errors.stock_minimo = "El stock mínimo no puede ser negativo";
  }
  if (parseFloat(data.precio_unitario) < 0) {
    errors.precio_unitario = "El precio no puede ser negativo";
  }

  return errors;
}

export function hasFormErrors(errors: InventarioFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
