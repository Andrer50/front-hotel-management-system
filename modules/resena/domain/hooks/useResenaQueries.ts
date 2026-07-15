import { useQuery } from "@tanstack/react-query";
import {
  getResenasAction,
  getResenaPromedioAction,
} from "@/core/resena/actions/resenaActions";
import { getReservationsAction } from "@/core/reservation/actions/reservationActions";
import { Resena, Estadia } from "@/core/resena/interfaces";

export const useGetResenasQuery = () => {
  return useQuery<Resena[]>({
    queryKey: ["resenas"],
    queryFn: getResenasAction,
  });
};

export const useGetResenaPromedioQuery = () => {
  return useQuery<{ promedio: number }>({
    queryKey: ["resena-promedio"],
    queryFn: getResenaPromedioAction,
  });
};

export const useGetStaysQuery = () => {
  return useQuery<Estadia[]>({
    queryKey: ["estadias"],
    queryFn: async () => {
      const reservations = await getReservationsAction();
      const completed = reservations.filter((r) => r.estado === "COMPLETADA");
      return completed.map((r) => ({
        id: r.estadia || r.id,
        reserva_codigo: r.codigo_reserva,
        huesped_nombre: r.huesped_nombre,
        habitacion_numero: r.habitacion_numero,
        fecha_entrada: r.fecha_entrada,
        fecha_salida: r.fecha_salida,
      }));
    },
  });
};
