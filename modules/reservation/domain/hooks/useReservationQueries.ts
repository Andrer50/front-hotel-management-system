import { useQuery } from "@tanstack/react-query";
import { getReservationsAction, getStatsAction } from "@/core/reservation/actions/reservationActions";

export const useGetReservationsQuery = () => {
  return useQuery({
    queryKey: ["reservations"],
    queryFn: getReservationsAction,
  });
};

export const useGetStatsQuery = () => {
  return useQuery({
    queryKey: ["stats"],
    queryFn: getStatsAction,
  });
};