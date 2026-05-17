"use client";

import { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Loader2,
  RefreshCw,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useGetReservationsQuery, useGetStatsQuery } from "@/modules/reservation/domain/hooks/useReservationQueries";
import { CreateReservationDialog } from "@/presentation/dashboard/admin/reservations/create-reservation-dialog";
import { UpdateReservationDialog } from "@/presentation/dashboard/admin/reservations/update-reservation-dialog";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return `${date.getDate()} ${months[date.getMonth()]}`;
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const avatarColors = [
  "bg-blue-100 text-blue-600",
  "bg-emerald-100 text-emerald-600",
  "bg-amber-100 text-amber-600",
  "bg-pink-100 text-pink-600",
  "bg-purple-100 text-purple-600",
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "CONFIRMADA":
      return { icon: CheckCircle2, color: "text-brand-blue", bg: "bg-brand-blue/5", label: "CONFIRMADA" };
    case "PENDIENTE":
      return { icon: Clock, color: "text-zinc-500", bg: "bg-zinc-100", label: "PENDIENTE" };
    case "EN_CURSO":
      return { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100", label: "EN CURSO" };
    case "COMPLETADA":
      return { icon: CheckCircle2, color: "text-gray-500", bg: "bg-gray-100", label: "COMPLETADA" };
    case "CANCELADA":
      return { icon: XCircle, color: "text-red-500", bg: "bg-red-50", label: "CANCELADA" };
    default:
      return { icon: Clock, color: "text-zinc-500", bg: "bg-zinc-100", label: status };
  }
};

export default function ReservationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDIENTE" | "CONFIRMADA" | "EN_CURSO" | "COMPLETADA" | "CANCELADA">("ALL");
  const [viewTab, setViewTab] = useState<"LISTADO" | "CALENDARIO">("LISTADO");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);

  const { data: reservations = [], isLoading: isLoadingReservations, refetch } = useGetReservationsQuery();
  const { data: stats = {}, isLoading: isLoadingStats } = useGetStatsQuery();

  const filteredReservations = useMemo(() => {
    return reservations.filter((res: any) => {
      const matchesStatus = statusFilter === "ALL" || res.estado === statusFilter;
      const matchesSearch =
        res.huesped_nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.codigo_reserva?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.habitacion_numero?.includes(searchQuery);
      return matchesStatus && matchesSearch;
    });
  }, [reservations, statusFilter, searchQuery]);

  const handleModify = (res: any) => {
    setSelectedReservation(res);
    setIsUpdateDialogOpen(true);
  };

  const handleCheckIn = (guest: string, code: string) => {
    toast.success(`Check-In de ${guest}`, { description: `Reserva ${code}` });
  };

  const handleExportReport = () => {
    toast.info("Generando Reporte de Reservas", {
      description: "Exportando listado de reservas en formato PDF...",
    });
  };

  const handleUpdateStatus = () => {
    refetch();
    toast.success("Reservas sincronizadas", {
      description: "Se han actualizado los estados de las reservas",
    });
  };

  const handleNotifyStaff = () => {
    toast.warning("Notificación Enviada", { description: "Alerta enviada al equipo de pisos" });
  };

  if (isLoadingReservations || isLoadingStats) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Header con título y selector de vista */}
      <div className="flex flex-col gap-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-1">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-dark-primary">
              Mantenimiento de Reservas
            </h2>
            <p className="text-dark-secondary text-sm">
              Gestiona el flujo de huéspedes, asignaciones de habitaciones y estados de confirmación.
            </p>
          </div>
          
          {/* Selector de Listado / Calendario */}
          <div className="flex bg-zinc-100 p-1 rounded-xl self-start md:self-center">
            <button
              onClick={() => setViewTab("LISTADO")}
              className={`text-xs font-extrabold px-5 py-2.5 rounded-lg transition-all ${
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
                toast.info("Vista de Calendario", { description: "Cargando diagrama..." });
              }}
              className={`text-xs font-extrabold px-5 py-2.5 rounded-lg transition-all ${
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

      {/* ========== BOTONES DE ACCIÓN (Exportar, Nueva Reserva, Actualizar) ========== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          {/* Espacio vacío para alinear botones a la derecha */}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleExportReport}
            className="h-11 px-5 border-zinc-200 bg-white text-brand-blue font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Exportar Informe
          </Button>

          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="h-11 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-emerald-600/15 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Nueva Reserva
          </Button>

          <Button
            onClick={handleUpdateStatus}
            className="h-11 px-5 bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-brand-blue/15 transition-all cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar Estado
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs">
          <span className="text-[10px] font-extrabold text-dark-secondary/80 tracking-widest uppercase">
            Ocupación Hoy
          </span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-extrabold text-dark-primary tracking-tight">
              {stats.ocupacion || 0}%
            </span>
          </div>
        </div>
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs">
          <span className="text-[10px] font-extrabold text-dark-secondary/80 tracking-widest uppercase">
            Total Huéspedes
          </span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-extrabold text-dark-primary tracking-tight">
              {stats.total_huespedes || 0}
            </span>
          </div>
        </div>
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs">
          <span className="text-[10px] font-extrabold text-dark-secondary/80 tracking-widest uppercase">
            Reservas Activas
          </span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-extrabold text-dark-primary tracking-tight">
              {stats.reservas_activas || 0}
            </span>
          </div>
        </div>
        <div className="bg-white border-l-4 border-l-brand-blue border-zinc-100 rounded-2xl p-6 shadow-xs">
          <span className="text-[10px] font-extrabold text-dark-secondary/80 tracking-widest uppercase">
            Total Reservas
          </span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-extrabold text-brand-blue tracking-tight">
              {reservations.length}
            </span>
            <CalendarDays className="h-5 w-5 text-brand-blue" />
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xl">
          <Search className="h-3.5 w-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-secondary/60" />
          <Input
            type="text"
            placeholder="Buscar por nombre, código o habitación..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border-zinc-200 rounded-xl text-xs h-10"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-100 p-1 rounded-xl">
            {(["ALL", "CONFIRMADA", "PENDIENTE", "EN_CURSO", "COMPLETADA", "CANCELADA"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all ${
                  statusFilter === status
                    ? "bg-white text-brand-blue shadow-xs"
                    : "text-dark-secondary hover:text-dark-primary"
                }`}
              >
                {status === "ALL" ? "Todos" : status}
              </button>
            ))}
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 border-zinc-200 bg-white rounded-xl shadow-xs">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabla de Reservas */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-100 text-[10px] font-bold text-dark-secondary/80 tracking-widest uppercase">
                <th className="pb-4">Código</th>
                <th className="pb-4">Huésped</th>
                <th className="pb-4">Habitación</th>
                <th className="pb-4">Fechas</th>
                <th className="pb-4">Noches</th>
                <th className="pb-4">Total</th>
                <th className="pb-4">Estado</th>
                <th className="pb-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.length > 0 ? (
                filteredReservations.map((res: any, idx: number) => {
                  const statusConfig = getStatusConfig(res.estado);
                  const StatusIcon = statusConfig.icon;
                  const avatarColor = avatarColors[idx % avatarColors.length];
                  const dateRange = `${formatDate(res.fecha_entrada)} - ${formatDate(res.fecha_salida)}`;
                  return (
                    <tr key={res.id} className="border-b border-zinc-50 hover:bg-zinc-50/20 transition-colors">
                      <td className="py-4">
                        <span className="text-xs font-mono font-bold text-dark-primary">{res.codigo_reserva}</span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full ${avatarColor} flex items-center justify-center font-bold text-xs`}>
                            {getInitials(res.huesped_nombre)}
                          </div>
                          <span className="text-xs font-bold text-dark-primary">{res.huesped_nombre}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-xs font-semibold">Hab. {res.habitacion_numero}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-xs font-semibold">{dateRange}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-xs font-semibold">{res.noches} noches</span>
                      </td>
                      <td className="py-4">
                        <span className="text-xs font-bold text-brand-blue">S/. {res.total}</span>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1 ${statusConfig.bg} ${statusConfig.color} text-[10px] font-extrabold px-2 py-1 rounded-full`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleModify(res)}
                            className="text-xs font-bold text-dark-secondary hover:text-dark-primary px-2 py-1 hover:bg-zinc-100 rounded-lg"
                          >
                            Modificar
                          </button>
                          <button
                            onClick={() => handleCheckIn(res.huesped_nombre, res.codigo_reserva)}
                            className="text-xs font-bold text-brand-blue hover:text-blue-700 px-2 py-1 hover:bg-blue-50 rounded-lg"
                          >
                            Check-In
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-dark-secondary">
                    No se encontraron reservas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-zinc-100/60 text-xs text-dark-secondary">
          <span>Mostrando {filteredReservations.length} de {reservations.length} reservas</span>
          <div className="flex items-center gap-1">
            <button className="text-dark-secondary hover:text-dark-primary font-bold disabled:opacity-50" disabled>
              Anterior
            </button>
            <span className="text-zinc-300">|</span>
            <button className="text-dark-secondary hover:text-dark-primary font-bold">Siguiente</button>
          </div>
        </div>
      </div>

      {/* Cards Inferiores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#031c46] rounded-2xl p-6 shadow-lg relative overflow-hidden text-white">
          <div className="relative z-10">
            <h3 className="text-base font-extrabold">Pronóstico de Ocupación</h3>
            <p className="text-xs text-white/85 mt-2">Ocupación actual del {stats.ocupacion || 0}%.</p>
            <button className="bg-white hover:bg-zinc-100 text-brand-blue font-extrabold text-[11px] px-5 py-2.5 rounded-xl mt-4">
              Ver Pronóstico
            </button>
          </div>
        </div>
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 text-red-600 text-xs font-bold">
            <AlertTriangle className="h-4 w-4" />
            ALERTA DE LIMPIEZA
          </div>
          <h3 className="text-base font-extrabold text-dark-primary mt-2">Habitaciones Sin Preparar</h3>
          <p className="text-xs text-dark-secondary mt-1">Verifica el estado de las habitaciones para los próximos check-ins.</p>
          <div className="flex gap-3 mt-4">
            <Button onClick={handleNotifyStaff} className="bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold h-10 px-5 rounded-xl">
              Notificar Equipo
            </Button>
            <Button variant="outline" className="border-zinc-200 text-dark-secondary text-xs font-extrabold h-10 px-5 rounded-xl">
              Ver Detalles
            </Button>
          </div>
        </div>
      </div>

      {/* Dialog para crear reserva */}
      <CreateReservationDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onReservationCreated={() => {
          refetch();
        }}
      />

      {/* Dialog para modificar reserva */}
      <UpdateReservationDialog
        isOpen={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        reservation={selectedReservation}
        onReservationUpdated={() => {
          refetch();
          setSelectedReservation(null);
        }}
      />
    </div>
  );
}