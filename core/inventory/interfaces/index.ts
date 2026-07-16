export type InventarioTipo = "SUMINISTRO" | "INVENTARIO";

export interface Inventario {
  id: number;
  sede: number;
  nombre: string;
  descripcion: string;
  stock_actual: number;
  stock_minimo: number;
  precio_unitario: string;
  tipo: InventarioTipo;
}

export interface InventarioFilters {
  tipo?: InventarioTipo;
  bajo_stock?: boolean;
}

export interface CreateInventarioRequest {
  sede: number;
  nombre: string;
  descripcion?: string;
  stock_actual: number;
  stock_minimo: number;
  precio_unitario: string;
  tipo: InventarioTipo;
}

export interface UpdateInventarioRequest {
  sede?: number;
  nombre?: string;
  descripcion?: string;
  stock_actual?: number;
  stock_minimo?: number;
  precio_unitario?: string;
  tipo?: InventarioTipo;
}

export interface InventarioPredictivo {
  id: number;
  nombre: string;
  descripcion: string;
  stock_actual: number;
  stock_minimo: number;
  stock_ideal: number;
  projected_consumption: number;
  projected_stock: number;
  suggested_order: number;
  estimated_stockout_date: string;
  sede: string;
}

