import { useQuery } from "@tanstack/react-query";
import { getGuestsAction, getGuestSelectDataAction } from "@/core/guest/actions/guestActions";

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

