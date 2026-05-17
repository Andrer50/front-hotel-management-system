import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLimpiezaAction } from "@/core/room/actions/limpiezaActions";
import { CreateLimpiezaRequest } from "@/core/room/interfaces";
import { updateLimpiezaAction } from "@/core/room/actions/limpiezaActions";

export const useCreateLimpiezaMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateLimpiezaRequest) => createLimpiezaAction(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["limpiezas"] });
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
        },
    });
};

export const useUpdateLimpiezaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => 
            updateLimpiezaAction(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["limpiezas"] });
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
        },
    });
};

import { deleteLimpiezaAction } from "@/core/room/actions/limpiezaActions";

export const useDeleteLimpiezaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteLimpiezaAction(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["limpiezas"] });
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
        },
    });
};