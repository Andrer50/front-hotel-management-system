import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createResenaAction,
  responderResenaAction,
  moderarResenaAction,
} from "@/core/resena/actions/resenaActions";
import {
  CreateResenaRequest,
  ResponderResenaRequest,
  ModerarResenaRequest,
} from "@/core/resena/interfaces";

export const useCreateResenaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createResenaAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resenas"] });
      queryClient.invalidateQueries({ queryKey: ["resena-promedio"] });
      queryClient.invalidateQueries({ queryKey: ["estadias"] });
    },
  });
};

export const useResponderResenaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: responderResenaAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resenas"] });
    },
  });
};

export const useModerarResenaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: moderarResenaAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resenas"] });
      queryClient.invalidateQueries({ queryKey: ["resena-promedio"] });
    },
  });
};
