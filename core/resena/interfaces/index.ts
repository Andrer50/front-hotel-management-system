export interface Resena {
  id: number;
  huesped_nombre: string;
  calificacion: number;
  comentario: string;
  fecha_creacion: string;
  respuesta_administrador: string | null;
  es_inapropiada: boolean;
}

export interface Estadia {
  id: number;
  reserva_codigo: string;
  huesped_nombre: string;
  habitacion_numero: string;
  fecha_entrada?: string;
  fecha_salida?: string;
}

export interface CreateResenaRequest {
  estadia: number;
  calificacion: number;
  comentario?: string;
}

export interface ResponderResenaRequest {
  id: number;
  respuesta_administrador: string;
}

export interface ModerarResenaRequest {
  id: number;
  es_inapropiada: boolean;
}
