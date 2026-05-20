export type IncidenciaPrioridad = "ALTA" | "MEDIA" | "BAJA";

export type IncidenciaEstado =
  | "PENDIENTE"
  | "EN_PROGRESO"
  | "RESUELTO"
  | "CANCELADO";

export interface IncidenciaUserDetails {
  id: number;
  full_name: string;
}

export interface Incidencia {
  id: number;
  titulo: string;
  descripcion: string;
  habitacion: number | null;
  habitacion_numero: string | null;
  area_comun: number | null;
  area_comun_nombre: string | null;
  prioridad: IncidenciaPrioridad;
  prioridad_display: string;
  estado: IncidenciaEstado;
  estado_display: string;
  asignado_a: number | null;
  asignado_a_details: IncidenciaUserDetails | null;
  reportado_por_details: IncidenciaUserDetails;
  fecha_reporte: string;
  fecha_resolucion: string | null;
}

export interface CreateIncidenciaRequest {
  titulo: string;
  descripcion: string;
  habitacion?: number;
  area_comun?: number;
  asignado_a?: number | null;
  prioridad?: IncidenciaPrioridad;
  estado?: IncidenciaEstado;
  fecha_resolucion?: string | null;
}

export interface UpdateIncidenciaRequest extends Partial<CreateIncidenciaRequest> {}

export interface PersonalMantenimiento {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}
