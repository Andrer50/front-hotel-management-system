"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CalendarDays,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Reservation {
  id: string;
  code: string;
  guestName: string;
  guestInitials: string;
  avatarBg: string;
  roomType: string;
  roomDetails: string;
  dates: string;
  nightsCount: number;
  status: "CONFIRMADA" | "PENDIENTE" | "CANCELADA";
}

const initialReservations: Reservation[] = [
  {
    id: "1",
    code: "REG-98321",
    guestName: "Alejandro Moreno",
    guestInitials: "AM",
    avatarBg: "bg-blue-100 text-blue-600",
    roomType: "Suite Ejecutiva",
    roomDetails: "Cama King-Size",
    dates: "12 May - 18 May",
    nightsCount: 6,
    status: "CONFIRMADA",
  },
  {
    id: "2",
    code: "REG-98245",
    guestName: "Elena Ruiz",
    guestInitials: "ER",
    avatarBg: "bg-emerald-100 text-emerald-600",
    roomType: "Doble Estándar",
    roomDetails: "Vista al Mar",
    dates: "15 May - 16 May",
    nightsCount: 1,
    status: "PENDIENTE",
  },
  {
    id: "3",
    code: "REG-98132",
    guestName: "Julian Beltrán",
    guestInitials: "JB",
    avatarBg: "bg-zinc-100 text-zinc-600",
    roomType: "Junior Suite",
    roomDetails: "Terraza Privada",
    dates: "20 May - 23 May",
    nightsCount: 3,
    status: "CANCELADA",
  },
  {
    id: "4",
    code: "REG-98431",
    guestName: "Ricardo Gomez",
    guestInitials: "RG",
    avatarBg: "bg-amber-100 text-amber-600",
    roomType: "Suite Presidencial",
    roomDetails: "Servicio VIP",
    dates: "14 May - 16 May",
    nightsCount: 2,
    status: "CONFIRMADA",
  },
];

export default function ReservationsPage() {
  const [reservations, setReservations] =
    useState<Reservation[]>(initialReservations);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "CONFIRMADA" | "PENDIENTE" | "CANCELADA"
  >("ALL");
  const [viewTab, setViewTab] = useState<"LISTADO" | "CALENDARIO">("LISTADO");

  // Filtros interactivos de reservas
  const filteredReservations = useMemo(() => {
    return reservations.filter((res) => {
      const matchesStatus =
        statusFilter === "ALL" || res.status === statusFilter;
      const matchesSearch =
        res.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.roomType.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [reservations, statusFilter, searchQuery]);

  const handleAction = (guest: string, action: string) => {
    toast(`Reserva de ${guest}`, {
      description: `Ejecutando acción: ${action} en el sistema PMS central.`,
    });
  };

  const handleCreateReservation = () => {
    toast.success("Nueva Reserva Creada", {
      description:
        "Abriendo el formulario rápido de asignación de habitaciones de lujo.",
    });
  };

  const handleNotifyStaff = () => {
    toast.warning("Notificación Enviada", {
      description:
        "Se ha enviado una alerta prioritaria de limpieza al equipo de pisos mediante la app interna.",
    });
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Cabecera de Página */}
      <div className="flex flex-col gap-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-1">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-dark-primary">
              Mantenimiento de Reservas
            </h2>
            <p className="text-dark-secondary text-sm max-w-2xl leading-relaxed">
              Gestiona el flujo de huéspedes, asignaciones de habitaciones y
              estados de confirmación en tiempo real.
            </p>
          </div>

          {/* Selector de Listado / Calendario */}
          <div className="flex bg-zinc-100 p-1 rounded-xl self-start md:self-center">
            <button
              onClick={() => setViewTab("LISTADO")}
              className={`text-xs font-extrabold px-5 py-2.5 rounded-lg transition-all cursor-pointer ${
                viewTab === "LISTADO"
                  ? "bg-white text-brand-blue shadow-xs"
                  : "text-dark-secondary hover:text-dark-primary"
              }`}
            >
              LISTADO
            </button>
            <button
              onClick={() => {
                setViewTab("CALENDARIO");
                toast("Vista de Calendario integrada", {
                  description:
                    "Cargando diagrama de Gantt del inventario de habitaciones...",
                });
              }}
              className={`text-xs font-extrabold px-5 py-2.5 rounded-lg transition-all cursor-pointer ${
                viewTab === "CALENDARIO"
                  ? "bg-white text-brand-blue shadow-xs"
                  : "text-dark-secondary hover:text-dark-primary"
              }`}
            >
              CALENDARIO
            </button>
          </div>
        </div>
      </div>

      {/* Grid de KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1 */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-[110px]">
          <span className="text-[10px] font-extrabold text-dark-secondary/80 tracking-widest uppercase">
            Ocupación Hoy
          </span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-extrabold text-dark-primary tracking-tight">
              84%
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 mb-1 bg-emerald-50 px-2 py-0.5 rounded-md">
              <TrendingUp className="h-3 w-3" />
              +2%
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-[110px]">
          <span className="text-[10px] font-extrabold text-dark-secondary/80 tracking-widest uppercase">
            Entradas Previstas
          </span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-extrabold text-dark-primary tracking-tight">
              12
            </span>
            <span className="text-xs font-semibold text-dark-secondary mb-1">
              4 pendientes
            </span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-[110px]">
          <span className="text-[10px] font-extrabold text-dark-secondary/80 tracking-widest uppercase">
            Salidas Previstas
          </span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-extrabold text-dark-primary tracking-tight">
              08
            </span>
            <span className="text-xs font-semibold text-dark-secondary mb-1">
              6 finalizadas
            </span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-l-4 border-l-brand-blue border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-[110px]">
          <span className="text-[10px] font-extrabold text-dark-secondary/80 tracking-widest uppercase">
            Nuevas (24H)
          </span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-extrabold text-brand-blue tracking-tight">
              24
            </span>
            <span className="text-brand-blue bg-blue-50 p-1.5 rounded-lg mb-0.5">
              <CalendarDays className="h-4.5 w-4.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Filtros e Inputs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xl">
          <Search className="h-3.5 w-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-secondary/60" />
          <Input
            type="text"
            placeholder="Buscar por nombre, habitación o localizador..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border-zinc-200 rounded-xl text-xs h-10 focus:border-brand-blue/30 transition-all shadow-xs"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-100 p-1 rounded-xl">
            {(["ALL", "CONFIRMADA", "PENDIENTE", "CANCELADA"] as const).map(
              (status) => {
                const isActive = statusFilter === status;
                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? "bg-white text-brand-blue shadow-xs"
                        : "text-dark-secondary hover:text-dark-primary"
                    }`}
                  >
                    {status === "ALL" ? "Todos los Estados" : status}
                  </button>
                );
              },
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 border-zinc-200 bg-white text-dark-secondary rounded-xl hover:text-dark-primary cursor-pointer shadow-xs"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabla de Reservas */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-zinc-100 text-[10px] font-bold text-dark-secondary/80 tracking-widest uppercase pb-4">
                <th className="pb-4 font-bold">Huésped</th>
                <th className="pb-4 font-bold">Tipo de Habitación</th>
                <th className="pb-4 font-bold">Fechas (In/Out)</th>
                <th className="pb-4 font-bold">Estado</th>
                <th className="pb-4 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.length > 0 ? (
                filteredReservations.map((res) => (
                  <tr
                    key={res.id}
                    className="border-b border-zinc-50 hover:bg-zinc-50/20 last:border-0 transition-colors"
                  >
                    {/* Huésped */}
                    <td className="py-4.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-9 w-9 rounded-full ${res.avatarBg} flex items-center justify-center font-bold text-xs shadow-xs`}
                        >
                          {res.guestInitials}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-dark-primary leading-tight">
                            {res.guestName}
                          </span>
                          <span className="text-[10px] font-semibold text-dark-secondary/70 mt-0.5">
                            {res.code}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Tipo Habitación */}
                    <td className="py-4.5 pr-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-dark-primary leading-tight">
                          {res.roomType}
                        </span>
                        <span className="text-[10px] font-semibold text-dark-secondary/70 mt-0.5">
                          {res.roomDetails}
                        </span>
                      </div>
                    </td>

                    {/* Fechas */}
                    <td className="py-4.5 pr-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-dark-primary leading-tight">
                          {res.dates}
                        </span>
                        <span className="text-[10px] font-medium text-dark-secondary/70 mt-0.5">
                          {res.nightsCount} Noches
                        </span>
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="py-4.5 pr-4">
                      {res.status === "CONFIRMADA" && (
                        <span className="inline-flex items-center gap-1 bg-brand-blue/5 text-brand-blue text-[10px] font-extrabold px-3 py-1 rounded-full border border-brand-blue/10">
                          <CheckCircle2 className="h-3 w-3 text-brand-blue" />
                          CONFIRMADA
                        </span>
                      )}
                      {res.status === "PENDIENTE" && (
                        <span className="inline-flex items-center gap-1 bg-zinc-100 text-zinc-500 text-[10px] font-extrabold px-3 py-1 rounded-full border border-zinc-200">
                          <Clock className="h-3 w-3 text-zinc-400" />
                          PENDIENTE
                        </span>
                      )}
                      {res.status === "CANCELADA" && (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-500 text-[10px] font-extrabold px-3 py-1 rounded-full border border-red-100">
                          <XCircle className="h-3 w-3 text-red-400" />
                          CANCELADA
                        </span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="py-4.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            handleAction(res.guestName, "Modificar Habitación")
                          }
                          className="text-xs font-bold text-dark-secondary hover:text-dark-primary px-2.5 py-1.5 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                        >
                          Modificar
                        </button>
                        <button
                          onClick={() =>
                            handleAction(res.guestName, "Check-In rápido")
                          }
                          className="text-xs font-bold text-brand-blue hover:text-blue-700 px-2.5 py-1.5 hover:bg-blue-50/50 rounded-lg transition-colors cursor-pointer"
                        >
                          Check-In
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-xs font-medium text-dark-secondary"
                  >
                    No se encontraron reservas que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-100/60 text-xs text-dark-secondary select-none">
          <span>Mostrando {filteredReservations.length} de 128 reservas</span>

          <div className="flex items-center gap-1 font-semibold">
            <button
              className="text-dark-secondary hover:text-dark-primary disabled:opacity-50 font-bold cursor-pointer"
              disabled
            >
              Anterior
            </button>
            <span className="text-zinc-300">|</span>
            <button
              className="text-dark-secondary hover:text-dark-primary font-bold cursor-pointer"
              onClick={() => toast("Página siguiente de reservas")}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Grid Inferior de Alertas y Pronósticos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Pico de Ocupación */}
        <div className="bg-[#031c46] rounded-2xl p-6 shadow-lg relative overflow-hidden flex flex-col justify-between text-white min-h-[190px]">
          {/* Fondo decorativo de ondas con SVG */}
          <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none">
            <svg
              width="220"
              height="150"
              viewBox="0 0 220 150"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 130C40 100 80 140 120 90C160 40 190 60 210 10"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex flex-col gap-2 relative z-10">
            <h3 className="text-base font-extrabold tracking-tight">
              Pico de Ocupación: Próximo Fin de Semana
            </h3>
            <p className="text-xs text-white/85 leading-relaxed font-medium max-w-sm">
              Se estima una ocupación del 96% debido al festival local.
              Recomendamos revisar el inventario de suites de lujo.
            </p>
          </div>

          <button
            onClick={() => toast("Cargando reporte de ocupación...")}
            className="bg-white hover:bg-zinc-100 text-brand-blue font-extrabold text-[11px] px-5 py-2.5 rounded-xl transition-all cursor-pointer w-fit shadow-md shadow-black/10 relative z-10"
          >
            Ver Pronóstico
          </button>
        </div>

        {/* Card 2: Alerta de Limpieza */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-[190px]">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-red-600 text-xs font-bold tracking-wider uppercase">
              <AlertTriangle className="h-4.5 w-4.5" />
              ALERTA DE LIMPIEZA
            </div>

            <h3 className="text-base font-extrabold text-dark-primary leading-tight">
              Habitaciones Sin Preparar
            </h3>
            <p className="text-xs text-dark-secondary leading-relaxed font-medium">
              5 Suites con entrada inmediata no han sido marcadas como
              &quot;Listas&quot; por el equipo de pisos.
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <Button
              onClick={handleNotifyStaff}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold px-5 py-2.5 h-10 rounded-xl cursor-pointer shadow-xs transition-colors"
            >
              Notificar Equipo
            </Button>
            <Button
              variant="outline"
              onClick={() => toast("Abriendo reporte de ama de llaves...")}
              className="border-zinc-200 bg-white text-dark-secondary hover:text-dark-primary text-xs font-extrabold h-10 px-5 rounded-xl cursor-pointer shadow-xs"
            >
              Ver Detalles
            </Button>
          </div>
        </div>
      </div>

      {/* Botón flotante o flotador del sidebar para crear nueva reserva rápido en móvil */}
      <Button
        onClick={handleCreateReservation}
        className="fixed bottom-6 right-6 md:hidden bg-brand-blue hover:bg-blue-600 text-white h-12 w-12 rounded-full shadow-2xl flex items-center justify-center cursor-pointer"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
