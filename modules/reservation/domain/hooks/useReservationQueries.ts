import { useQuery } from "@tanstack/react-query";
import {
  getReservationsAction,
  getStatsAction,
  getReservationByIdAction,
} from "@/core/reservation/actions/reservationActions";
import { Reservation } from "@/core/reservation/interfaces";

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

export const useGetReservationQuery = (id: number) => {
  return useQuery<Reservation>({
    queryKey: ["reservation", id],
    queryFn: () => getReservationByIdAction(id),
    enabled: !!id,
  });
};
