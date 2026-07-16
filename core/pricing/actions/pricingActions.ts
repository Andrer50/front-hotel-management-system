import { apiClient } from "@/lib/http-client";
import {
  DynamicPricingAnalysisRequest,
  DynamicPricingAnalysisResponse,
  ApplyPricingRequest,
} from "../interfaces";

export const getDynamicPricingAnalysisAction = async (
  request?: DynamicPricingAnalysisRequest,
): Promise<DynamicPricingAnalysisResponse> => {
  return apiClient.post<DynamicPricingAnalysisResponse>(
    "hotel/precios/analisis-ia",
    request || {},
  );
};

export const applyPricingAction = async (
  request: ApplyPricingRequest,
): Promise<{ message: string }> => {
  return apiClient.post<{ message: string }>(
    "hotel/precios/aplicar-tarifas",
    request,
  );
};
