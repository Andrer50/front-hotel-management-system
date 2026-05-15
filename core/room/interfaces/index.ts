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
}

export interface CreateRoomRequest {
  sede?: number;
  planta?: number;
  numero: string;
  tipo: RoomTipo;
  capacidad: number;
  precio_base: number;
  estado: RoomEstado;
}

export interface UpdateRoomRequest extends Partial<CreateRoomRequest> {
  id: number;
}
