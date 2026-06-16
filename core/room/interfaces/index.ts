export interface Planta {
  id: number;
  nombre: string;
  numero: number;
}

export type RoomTipo = 'INDIVIDUAL' | 'DOBLE' | 'SUITE' | 'FAMILIAR';
export type RoomEstado = 'DISPONIBLE' | 'OCUPADA' | 'MANTENIMIENTO' | 'SUCIA' | 'LIMPIEZA';

export interface Room {
  id: number;
  sede?: number;
  planta?: number;
  planta_details?: Planta;
  numero: string;
  tipo: RoomTipo;
  capacidad: number;
  precio_base: string;
  estado: RoomEstado;
  tipo_display?: string;
  estado_display?: string;
  is_active: boolean;
}

export interface CreateRoomRequest {
  sede?: number;
  planta?: number;
  numero: string;
  tipo: RoomTipo;
  capacidad: number;
  precio_base: number;
  estado: RoomEstado;
  is_active?: boolean; // Estado activo por defecto
}

export interface UpdateRoomRequest extends Partial<CreateRoomRequest> {
  id: number;
}

export interface RegistroLimpieza {
    id: number;
    habitacion: number;
    habitacion_numero: string;
    personal_limpieza: number | null;
    personal_limpieza_details: { id: number; full_name: string } | null;
    estado: 'EN_PROGRESO' | 'COMPLETADO' | 'INSPECCIONADO';
    estado_display: string;
    fecha_inicio: string;
    fecha_fin: string | null;
    observaciones: string | null;
}

export interface Incidencia {
    id: number;
    titulo: string;
    descripcion: string;
    habitacion: number | null;
    habitacion_numero: string | null;
    area_comun: number | null;
    area_comun_nombre: string | null;
    prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
    prioridad_display: string;
    estado: 'PENDIENTE' | 'EN_PROGRESO' | 'RESUELTO' | 'CANCELADO';
    estado_display: string;
    asignado_a_details: { id: number; full_name: string } | null;
    reportado_por_details: { id: number; full_name: string };
    fecha_reporte: string;
    fecha_resolucion: string | null;
}

export interface CreateIncidenciaRequest {
    titulo: string;
    descripcion: string;
    habitacion: number;
    asignado_a?: number | null;
    prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
    reportado_por: number;
}

export interface CreateLimpiezaRequest {
    habitacion: number;
    personal_limpieza: number | null;
    observaciones?: string;
}

export interface PersonalLimpieza {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
}