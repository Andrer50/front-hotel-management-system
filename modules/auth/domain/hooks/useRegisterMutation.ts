import { useMutation } from "@tanstack/react-query";
import { registerAction } from "@/core/auth/actions/authActions";
import { RegisterAuthenticationRequest } from "@/core/auth/interfaces";

export const useRegisterMutation = () => {
    return useMutation({
        mutationFn: (data: RegisterAuthenticationRequest) => registerAction(data),
    });
};
