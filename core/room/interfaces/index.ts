export interface Room {
  id: number;
  sede?: number;
  numero: string;
  tipo: 'INDIVIDUAL' | 'DOBLE' | 'SUITE' | 'FAMILIAR';
  capacidad: number;
  precio_base: string;
  estado: 'DISPONIBLE' | 'OCUPADA' | 'MANTENIMIENTO' | 'SUCIA';
  tipo_display?: string;
  estado_display?: string;
}

export interface CreateRoomRequest {
  sede?: number;
  numero: string;
  tipo: string;
  capacidad: number;
  precio_base: number;
  estado: string;
}

export interface UpdateRoomRequest extends Partial<CreateRoomRequest> {
  id: number;
}
