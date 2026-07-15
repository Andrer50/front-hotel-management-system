import { useMutation, useQuery } from "@tanstack/react-query";
import { getGuestsAction, getGuestSelectDataAction, obtenerRecomendacionesIAAction, PerfilHuespedPayload } from "@/core/guest/actions/guestActions";

export const useGetGuestsQuery = () => {
  return useQuery({
    queryKey: ["guests"],
    queryFn: getGuestsAction,
  });
};

export const useGetGuestSelectDataQuery = () => {
  return useQuery({
    queryKey: ["guests", "select-data"],
    queryFn: getGuestSelectDataAction,
  });
};

export const useRecomendacionIAMutation = () => {
  return useMutation({
    mutationFn: (payload: PerfilHuespedPayload) => obtenerRecomendacionesIAAction(payload),
    onSuccess: (response) => {
      // Si usas sonner toast o similar, puedes disparar una notificación de éxito aquí
    },
  });
};
