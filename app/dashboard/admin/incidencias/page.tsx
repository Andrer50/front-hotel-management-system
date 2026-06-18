"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Settings2,
  User,
  Calendar,
  ArrowUpRight,
  BedDouble,
  Building2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Incidencia,
  IncidenciaEstado,
  IncidenciaPrioridad,
} from "@/core/incidencia/interfaces";
import {
  useGetIncidenciasQuery,
  useGetIncidenciasConResueltasQuery,
} from "@/modules/incidencia/domain/hooks/useIncidenciaQueries";
import { CreateIncidenciaDialog } from "@/presentation/dashboard/admin/incidencias/create-incidencia-dialog";
import { UpdateIncidenciaDialog } from "@/presentation/dashboard/admin/incidencias/update-incidencia-dialog";

const ESTADO_FILTERS = [
  "Todos",
  "PENDIENTE",
  "EN_PROGRESO",
  "RESUELTO",
  "CANCELADO",
] as const;
const PRIORIDAD_FILTERS = ["Todas", "ALTA", "MEDIA", "BAJA"] as const;

export default function IncidenciasPage() {
  const [includeResueltas, setIncludeResueltas] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<string>("Todos");
  const [prioridadFilter, setPrioridadFilter] = useState<string>("Todas");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedIncidencia, setSelectedIncidencia] =
    useState<Incidencia | null>(null);

  const { data: activas = [], isLoading: loadingActivas } =
    useGetIncidenciasQuery();
  const { data: todas = [], isLoading: loadingTodas } =
    useGetIncidenciasConResueltasQuery(includeResueltas);

  const incidencias = includeResueltas ? todas : activas;
  const isLoading = includeResueltas ? loadingTodas : loadingActivas;

  const stats = useMemo(() => {
    const source = includeResueltas ? todas : activas;
    return {
      total: source.length,
      alta: source.filter((i) => i.prioridad === "ALTA").length,
      enProgreso: source.filter((i) => i.estado === "EN_PROGRESO").length,
      resueltas: source.filter((i) => i.estado === "RESUELTO").length,
    };
  }, [activas, todas, includeResueltas]);

  const filteredIncidencias = useMemo(() => {
    return incidencias.filter((inc) => {
      const matchesSearch = inc.titulo
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesEstado =
        estadoFilter === "Todos" || inc.estado === estadoFilter;
      const matchesPrioridad =
        prioridadFilter === "Todas" || inc.prioridad === prioridadFilter;
      return matchesSearch && matchesEstado && matchesPrioridad;
    });
  }, [incidencias, searchQuery, estadoFilter, prioridadFilter]);

  const activasList = filteredIncidencias.filter(
    (i) => i.estado !== "RESUELTO" && i.estado !== "CANCELADO",
  );
  const resueltasList = filteredIncidencias.filter(
    (i) => i.estado === "RESUELTO" || i.estado === "CANCELADO",
  );

  const handleSelect = (inc: Incidencia) => {
    setSelectedIncidencia(inc);
    setIsUpdateOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 space-y-8 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[#0051b3] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
          <div className="relative z-10 flex justify-between items-start">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
                  Portal de Mantenimiento
                </span>
                <h2 className="text-3xl font-bold tracking-tight">
                  Incidencias
                </h2>
              </div>
              <p className="text-blue-100/80 text-sm font-medium max-w-[280px] leading-relaxed">
                Gestión centralizada de reportes de habitaciones y áreas
                comunes.
              </p>
            </div>
            <div className="text-5xl font-bold tracking-tighter opacity-90">
              {stats.total}
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
            label="Alta prioridad"
            value={stats.alta}
          />
          <StatCard
            icon={<Clock className="h-5 w-5 text-amber-500" />}
            label="En progreso"
            value={stats.enProgreso}
          />
          <StatCard
            icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
            label="Resueltas"
            value={stats.resueltas}
            className="col-span-2"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Buscar por título..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-xl border-zinc-200 text-xs bg-white"
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeResueltas}
            onChange={(e) => setIncludeResueltas(e.target.checked)}
            className="rounded border-zinc-300"
          />
          <span className="text-xs font-bold text-zinc-600">
            Incluir resueltas
          </span>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterPills
          items={ESTADO_FILTERS}
          active={estadoFilter}
          onChange={setEstadoFilter}
        />
        <FilterPills
          items={PRIORIDAD_FILTERS}
          active={prioridadFilter}
          onChange={setPrioridadFilter}
        />
      </div>

      <div className="space-y-3">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-3xl" />
          ))
        ) : filteredIncidencias.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {activasList.map((inc) => (
              <IncidenciaCard
                key={inc.id}
                incidencia={inc}
                onClick={() => handleSelect(inc)}
              />
            ))}
            {includeResueltas &&
              activasList.length > 0 &&
              resueltasList.length > 0 && (
                <div className="flex items-center gap-2 py-2">
                  <div className="h-px flex-1 bg-zinc-200" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Resueltas / Canceladas
                  </span>
                  <div className="h-px flex-1 bg-zinc-200" />
                </div>
              )}
            {(includeResueltas ? resueltasList : []).map((inc) => (
              <IncidenciaCard
                key={inc.id}
                incidencia={inc}
                onClick={() => handleSelect(inc)}
                muted
              />
            ))}
          </>
        )}
      </div>

      <button
        onClick={() => setIsCreateOpen(true)}
        className="fixed bottom-8 right-8 h-16 w-16 bg-[#0051b3] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer z-50"
      >
        <Plus className="h-8 w-8" />
      </button>

      <CreateIncidenciaDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      <UpdateIncidenciaDialog
        key={
          selectedIncidencia
            ? `update-${selectedIncidencia.id}-${isUpdateOpen}`
            : "none"
        }
        open={isUpdateOpen}
        onOpenChange={setIsUpdateOpen}
        incidencia={selectedIncidencia}
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-4 border border-zinc-100 shadow-sm flex flex-col gap-2",
        className,
      )}
    >
      {icon}
      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
        {label}
      </span>
      <span className="text-2xl font-bold text-zinc-900">{value}</span>
    </div>
  );
}

function FilterPills({
  items,
  active,
  onChange,
}: {
  items: readonly string[];
  active: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-2 p-1 bg-zinc-100/50 rounded-2xl w-fit flex-wrap">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize",
            active === item
              ? "bg-white text-[#0051b3] shadow-sm"
              : "text-zinc-400 hover:text-zinc-600",
          )}
        >
          {item.replace(/_/g, " ").toLowerCase()}
        </button>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-20 text-center space-y-4">
      <div className="mx-auto w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center">
        <Settings2 className="h-8 w-8 text-zinc-300" />
      </div>
      <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest">
        No se encontraron incidencias
      </p>
    </div>
  );
}

function IncidenciaCard({
  incidencia,
  onClick,
  muted = false,
}: {
  incidencia: Incidencia;
  onClick: () => void;
  muted?: boolean;
}) {
  const prioridadConfig = getPrioridadConfig(incidencia.prioridad);
  const estadoConfig = getEstadoConfig(incidencia.estado);
  const ubicacion = incidencia.habitacion_numero
    ? `Hab. ${incidencia.habitacion_numero}`
    : (incidencia.area_comun_nombre ?? "Sin ubicación");

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white hover:bg-zinc-50 transition-all p-4 rounded-[1.5rem] border border-zinc-100 flex items-center gap-6 group cursor-pointer shadow-sm hover:shadow-md",
        muted && "opacity-60",
      )}
    >
      <div
        className={cn(
          "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0",
          prioridadConfig.bg,
        )}
      >
        {incidencia.habitacion ? (
          <BedDouble className={cn("h-6 w-6", prioridadConfig.icon)} />
        ) : (
          <Building2 className={cn("h-6 w-6", prioridadConfig.icon)} />
        )}
      </div>

      <div className="flex-1 space-y-1 min-w-0">
        <h3
          className={cn(
            "font-bold text-zinc-900 text-base tracking-tight truncate",
            muted && "line-through text-zinc-500",
          )}
        >
          {incidencia.titulo}
        </h3>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-[11px] font-bold text-zinc-500">
              {new Date(incidencia.fecha_reporte).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-[11px] font-bold text-zinc-500">
              {incidencia.asignado_a_details?.full_name ?? "Sin asignar"}
            </span>
          </div>
          <span className="text-[11px] font-bold text-zinc-400">
            {ubicacion}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <div
          className={cn(
            "px-3 py-1 rounded-lg flex items-center gap-2",
            estadoConfig.color,
          )}
        >
          <div className={cn("h-1.5 w-1.5 rounded-full", estadoConfig.dot)} />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            {estadoConfig.label}
          </span>
        </div>
        <span
          className={cn(
            "text-[10px] font-extrabold px-2.5 py-1 rounded-lg border",
            prioridadConfig.badge,
          )}
        >
          {incidencia.prioridad_display}
        </span>
      </div>

      <ArrowUpRight className="h-5 w-5 text-zinc-300 group-hover:text-zinc-500 shrink-0 transition-colors" />
    </div>
  );
}

function getPrioridadConfig(prioridad: IncidenciaPrioridad) {
  switch (prioridad) {
    case "ALTA":
      return {
        bg: "bg-red-50",
        icon: "text-red-500",
        badge: "bg-red-100 text-red-600 border-red-200",
      };
    case "MEDIA":
      return {
        bg: "bg-amber-50",
        icon: "text-amber-500",
        badge: "bg-amber-50 text-amber-600 border-amber-200",
      };
    default:
      return {
        bg: "bg-zinc-100",
        icon: "text-zinc-400",
        badge: "bg-zinc-100 text-zinc-500 border-zinc-200",
      };
  }
}

function getEstadoConfig(estado: IncidenciaEstado) {
  switch (estado) {
    case "PENDIENTE":
      return {
        color: "bg-amber-50 text-amber-600",
        label: "Pendiente",
        dot: "bg-amber-500",
      };
    case "EN_PROGRESO":
      return {
        color: "bg-blue-50 text-blue-600",
        label: "En progreso",
        dot: "bg-blue-500",
      };
    case "RESUELTO":
      return {
        color: "bg-emerald-50 text-emerald-600",
        label: "Resuelto",
        dot: "bg-emerald-500",
      };
    case "CANCELADO":
      return {
        color: "bg-zinc-100 text-zinc-500",
        label: "Cancelado",
        dot: "bg-zinc-400",
      };
    default:
      return {
        color: "bg-zinc-50 text-zinc-400",
        label: estado,
        dot: "bg-zinc-300",
      };
  }
}
