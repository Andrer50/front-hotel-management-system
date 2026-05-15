import { useQuery } from "@tanstack/react-query";
import { getGuestsAction } from "@/core/guest/actions/guestActions";

export const useGetGuestsQuery = () => {
  return useQuery({
    queryKey: ["guests"],
    queryFn: getGuestsAction,
  });
};
