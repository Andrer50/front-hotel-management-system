import { Inventario } from "@/core/inventory/interfaces";

export interface ConsumoExtra {
  id: number;
  estadia: number;
  inventario: number | null;
  inventario_details: Inventario | null;
  descripcion: string;
  cantidad: number;
  precio_unitario: string;
  total: number;
  fecha_consumo: string;
}

export interface CreateConsumoExtraRequest {
  reserva: number; // Enviamos reserva para que el backend busque/cree la estadía
  inventario?: number;
  descripcion: string;
  cantidad: number;
  precio_unitario?: string; // Opcional, si no se envía, toma el del inventario
}
