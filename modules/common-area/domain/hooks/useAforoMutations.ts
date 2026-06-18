import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createAforoAction,
    updateAforoAction,
    checkInAforoAction,
    checkOutAforoAction
} from "@/core/common-area/actions/aforoActions";
import { CreateAforoRequest, UpdateAforoRequest } from "@/core/common-area/interfaces";

export const useAforoMutations = () => {
    const queryClient = useQueryClient();

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ["aforos"] });
        // Invalidar áreas comunes porque el aforo_actual cambia en check-in/out
        queryClient.invalidateQueries({ queryKey: ["common-areas"] });
    };

    const createMutation = useMutation({
        mutationFn: (data: CreateAforoRequest) => createAforoAction(data),
        onSuccess: invalidate,
    });

    const updateMutation = useMutation({
        mutationFn: (data: UpdateAforoRequest) => updateAforoAction(data),
        onSuccess: invalidate,
    });

    const checkInMutation = useMutation({
        mutationFn: (id: number) => checkInAforoAction(id),
        onSuccess: invalidate,
    });

    const checkOutMutation = useMutation({
        mutationFn: (id: number) => checkOutAforoAction(id),
        onSuccess: invalidate,
    });

    return { createMutation, updateMutation, checkInMutation, checkOutMutation };
};