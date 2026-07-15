import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDynamicPricingAnalysisAction,
  applyPricingAction,
} from "@/core/pricing/actions/pricingActions";
import {
  DynamicPricingAnalysisRequest,
  ApplyPricingRequest,
} from "@/core/pricing/interfaces";

export const useGetDynamicPricingAnalysisMutation = () => {
  return useMutation({
    mutationFn: (request?: DynamicPricingAnalysisRequest) =>
      getDynamicPricingAnalysisAction(request),
  });
};

export const useApplyPricingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ApplyPricingRequest) => applyPricingAction(request),
    onSuccess: () => {
      // Invalidar consultas de habitaciones ya que sus precios cambiaron
      queryClient.invalidateQueries({ queryKey: ["habitaciones"] });
    },
  });
};
