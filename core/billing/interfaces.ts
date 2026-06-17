export interface Comprobante {
  id: number;
  reserva: number;
  reserva_codigo?: string;
  tipo_comprobante: "BOLETA" | "FACTURA";
  serie: string;
  numero: number;
  numero_completo?: string;
  documento_cliente: string;
  nombre_cliente: string;
  metodo_pago: "EFECTIVO" | "TARJETA" | "TRANSFERENCIA";
  monto_total: number;
  fecha_emision: string;
}

export interface CreateComprobanteRequest {
  reserva: number;
  tipo_comprobante: "BOLETA" | "FACTURA";
  documento_cliente: string;
  nombre_cliente: string;
  metodo_pago: "EFECTIVO" | "TARJETA" | "TRANSFERENCIA";
  monto_total: number;
}
