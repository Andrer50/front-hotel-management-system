import { useQuery } from "@tanstack/react-query";
import { getReservationsAction, getStatsAction, Reservation } from "@/core/reservation/actions/reservationActions";

export const useGetReservationsQuery = () => {
  return useQuery<Reservation[]>({
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