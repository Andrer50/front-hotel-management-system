import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  createReservationAction, 
  updateReservationAction, 
  deleteReservationAction,
  checkInReservationAction,
  checkOutReservationAction,
} from "@/core/reservation/actions/reservationActions";

export const useCreateReservationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReservationAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
};

export const useUpdateReservationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateReservationAction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
};

export const useDeleteReservationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReservationAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
};

export const useCheckInMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, observaciones }: { id: number; observaciones?: string }) =>
      checkInReservationAction(id, observaciones),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] }); // 👈 refresca habitaciones también
    },
  });
};

export const useCheckOutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, observaciones }: { id: number; observaciones?: string }) =>
      checkOutReservationAction(id, observaciones),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] }); // 👈 refresca habitaciones también
    },
  });
};