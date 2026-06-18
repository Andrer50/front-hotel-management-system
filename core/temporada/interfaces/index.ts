export interface Temporada {
  id: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  fecha_inicio_formateada?: string;
  fecha_fin_formateada?: string;
  porcentaje: number;
  is_active: boolean;
  estado_label?: string;
}

export interface CreateTemporadaRequest {
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  porcentaje: number;
  is_active: boolean;
}

export interface UpdateTemporadaRequest {
  nombre?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  porcentaje?: number;
  is_active?: boolean;
}
