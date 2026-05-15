import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  createGuestAction, 
  updateGuestAction, 
  deleteGuestAction 
} from "@/core/guest/actions/guestActions";
import { CreateGuestRequest, UpdateGuestRequest, Guest } from "@/core/guest/interfaces";

export const useCreateGuestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGuestRequest) => createGuestAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    },
  });
};

export const useUpdateGuestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateGuestRequest) => updateGuestAction(data),
    onSuccess: (updatedGuest) => {
      // Actualización manual del caché para evitar flicker
      queryClient.setQueryData(["guests"], (oldGuests: Guest[] | undefined) => {
        if (!oldGuests) return [updatedGuest];
        return oldGuests.map((guest) =>
          guest.id === updatedGuest.id ? updatedGuest : guest
        );
      });
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    },
  });
};

export const useDeleteGuestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteGuestAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    },
  });
};
