import { useQuery } from "@tanstack/react-query";
import { getLimpiezasAction } from "@/core/room/actions/limpiezaActions";
import { useGetUsersQuery } from "@/modules/user/domain/hooks/useUserQueries";
import { useMemo } from "react";

export const useGetLimpiezasQuery = () => {
    return useQuery({
        queryKey: ["limpiezas"],
        queryFn: getLimpiezasAction,
        refetchInterval: 30000,
    });
};

export const useGetPersonalLimpiezaQuery = () => {
    const { data: users = [], ...rest } = useGetUsersQuery();

    const filtered = useMemo(() => {
        return users.filter((user) =>
            user.role_details?.permissions.some(
                (p) => p.codename === "can_clean_rooms",
            ),
        );
    }, [users]);

    return {
        ...rest,
        data: filtered,
    };
};