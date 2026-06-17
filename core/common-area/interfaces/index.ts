export interface Sede {
  id: number;
  nombre: string;
}

export type CommonAreaEstado = "DISPONIBLE" | "OCUPADA" | "MANTENIMIENTO" | "SUCIA" | "RESTRINGIDO";

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
  is_active: boolean;
}

export interface CreateCommonAreaRequest {
  sede: number;
  nombre: string;
  capacidad_maxima: number;
  estado: CommonAreaEstado;
  categoria?: string;
  descripcion?: string;
  imagen?: File | null;
  is_active?: boolean;
}

export interface UpdateCommonAreaRequest extends Partial<CreateCommonAreaRequest> {
  id: number;
}

export type AforoEstado = "PENDIENTE" | "CONFIRMADA" | "EN_CURSO" | "COMPLETADA" | "CANCELADA";

export interface HuespedAforo {
  id: number;
  nombre_completo: string;
  documento: string;
}

export interface RegistroAforo {
  id: number;
  area_comun: number;
  huesped: number;
  huesped_details: HuespedAforo;
  area_comun_nombre: string;
  area_comun_capacidad: number;
  estado: AforoEstado;
  estado_display: string;
  fecha_ingreso_programada: string;
  fecha_salida_programada: string;
  fecha_ingreso_real?: string;
  fecha_salida_real?: string;
  notas?: string;
  registrado_por_nombre?: string;
}

export interface CreateAforoRequest {
  area_comun: number;
  huesped: number;
  fecha_ingreso_programada: string;
  fecha_salida_programada: string;
  notas?: string;
}

export interface UpdateAforoRequest {
  id: number;
  estado?: AforoEstado;
  notas?: string;
}