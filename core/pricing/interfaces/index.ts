export interface RoomPricingRecommendation {
  habitacion_tipo: string;
  precio_base_actual: number;
  precio_dinamico_sugerido: number;
  porcentaje_cambio: number;
  justificacion: string;
}

export interface DynamicPricingAnalysisResponse {
  recomendaciones: RoomPricingRecommendation[];
  insights_mercado: string;
  meta: {
    tasa_ocupacion_real: number;
    tasa_ocupacion_analizada: number;
    es_simulacion: boolean;
  };
}

export interface DynamicPricingAnalysisRequest {
  ocupacion_simulada?: number;
  competidores?: Record<string, number>;
  temporada_simulada?: string;
}

export interface ApplyPricingRequest {
  precios: Record<string, number>;
}
