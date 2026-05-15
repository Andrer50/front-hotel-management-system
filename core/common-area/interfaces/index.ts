export interface Sede {
  id: number;
  nombre: string;
}

export type CommonAreaEstado = "DISPONIBLE" | "MANTENIMIENTO" | "RESTRINGIDO";

export interface CommonArea {
  id: number;
  sede: number;
  sede_details?: Sede;
  nombre: string;
  capacidad_maxima: number;
  aforo_actual: number;
  estado: CommonAreaEstado;
  estado_display?: string;
  imagen?: string | null;
  categoria?: string | null;
  descripcion?: string | null;
}

export interface CreateCommonAreaRequest {
  sede: number;
  nombre: string;
  capacidad_maxima: number;
  estado: CommonAreaEstado;
  categoria?: string;
  descripcion?: string;
  imagen?: File | null;
}

export interface UpdateCommonAreaRequest extends Partial<CreateCommonAreaRequest> {
  id: number;
}
