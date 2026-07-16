export interface Temporada {
  id: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  porcentaje: number;
  is_active: boolean;
  fecha_inicio_formateada?: string;
  fecha_fin_formateada?: string;
  estado_label?: string;
}