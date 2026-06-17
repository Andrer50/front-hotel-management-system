export interface Reservation {
  id: number;
  codigo_reserva: string;
  huesped: number;
  huesped_nombre: string;
  huesped_documento: string;
  habitacion: number;
  habitacion_numero: string;
  fecha_entrada: string;
  fecha_salida: string;
  fecha_reserva: string;
  estado: "PENDIENTE" | "CONFIRMADA" | "EN_CURSO" | "COMPLETADA" | "CANCELADA";
  estado_display: string;
  tarifa_aplicada: number;
  origen: "DIRECTO" | "BOOKING" | "EXPEDIA" | "AIRBNB";
  origen_display: string;
  noches: number;
  total: number;
  consumos_extra_total: number;
}

export interface CreateReservationRequest {
  huesped: number;
  habitacion: number;
  fecha_entrada: string;
  fecha_salida: string;
  tarifa_aplicada: number;
  origen: string;
}

export interface UpdateReservationRequest {
  estado?: string;
  tarifa_aplicada?: number;
}

export interface ReservationStats {
  ocupacion: number;
  total_huespedes: number;
  reservas_activas: number;
}
