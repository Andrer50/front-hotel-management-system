import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createIncidenciaAction, updateIncidenciaAction, deleteIncidenciaAction } from "@/core/room/actions/incidenciaActions";
import { CreateIncidenciaRequest } from "@/core/room/interfaces";

export const useCreateIncidenciaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateIncidenciaRequest) => createIncidenciaAction(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["incidencias"] });
            queryClient.invalidateQueries({ queryKey: ["incidencias-todas"] });
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
        },
    });
};

export const useUpdateIncidenciaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => updateIncidenciaAction(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["incidencias"] });
            queryClient.invalidateQueries({ queryKey: ["incidencias-todas"] });
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
        },
    });
};

export const useDeleteIncidenciaMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteIncidenciaAction(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["incidencias"] });
            queryClient.invalidateQueries({ queryKey: ["incidencias-todas"] });
            queryClient.invalidateQueries({ queryKey: ["rooms"] });
        },
    });
};