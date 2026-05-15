"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Download,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock,
  UserPlus2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CreateGuestDialog } from "@/presentation/dashboard/admin/clients/create-guest-dialog";
import { useGetGuestsQuery } from "@/modules/guest/domain/hooks/useGuestQueries";
import { useDeleteGuestMutation } from "@/modules/guest/domain/hooks/useGuestMutations";
import { Loader2 } from "lucide-react";

// Interfaz para Huéspedes
interface Guest {
  id: string;
  name: string;
  email: string;
  lastCheckIn: string;
  totalStays: number;
  status: "ACTIVE" | "INACTIVE";
  avatarBg: string;
  initials: string;
}

const initialGuests: Guest[] = [
  {
    id: "1",
    name: "Alex Thompson",
    email: "alex.thompson@examplem.com",
    lastCheckIn: "12 Oct, 2023",
    totalStays: 18,
    status: "ACTIVE",
    avatarBg: "bg-blue-100 text-blue-600",
    initials: "AT",
  },
  {
    id: "2",
    name: "Elena Rodríguez",
    email: "elena.r@corporate.com",
    lastCheckIn: "24 Sep, 2023",
    totalStays: 5,
    status: "ACTIVE",
    avatarBg: "bg-emerald-100 text-emerald-600",
    initials: "ER",
  },
  {
    id: "3",
    name: "Marcus Weber",
    email: "m.weber@tech-labs.de",
    lastCheckIn: "05 Ago, 2023",
    totalStays: 2,
    status: "INACTIVE",
    avatarBg: "bg-zinc-100 text-zinc-600",
    initials: "MW",
  },
  {
    id: "4",
    name: "Sarah Jansens",
    email: "s.jansens@lifestyle.net",
    lastCheckIn: "24 Oct, 2023",
    totalStays: 21,
    status: "ACTIVE",
    avatarBg: "bg-pink-100 text-pink-600",
    initials: "SJ",
  },
  {
    id: "5",
    name: "Oliver Lang",
    email: "oliver.l@ventures.ch",
    lastCheckIn: "15 May, 2023",
    totalStays: 1,
    status: "INACTIVE",
    avatarBg: "bg-amber-100 text-amber-600",
    initials: "OL",
  },
  {
    id: "6",
    name: "Sophia Martinez",
    email: "s.martinez@luxurytravel.com",
    lastCheckIn: "01 Nov, 2023",
    totalStays: 12,
    status: "ACTIVE",
    avatarBg: "bg-indigo-100 text-indigo-600",
    initials: "SM",
  },
];

export default function ReceptionGuestsPage() {
  const { data: guestsData = [], isLoading } = useGetGuestsQuery();
  const deleteGuestMutation = useDeleteGuestMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Mapeo y Filtro de huéspedes interactivo
  const filteredGuests = useMemo(() => {
    // Mapeamos los datos del backend a la interfaz del frontend
    const mappedGuests: Guest[] = guestsData.map((g) => ({
      id: g.id.toString(),
      name: `${g.nombre} ${g.apellido}`,
      email: g.email,
      lastCheckIn: "N/A", // El backend aún no provee esto en el modelo Huesped
      totalStays: 0, // El backend aún no provee esto
      status: "ACTIVE", // Por defecto activo
      avatarBg: "bg-blue-100 text-blue-600",
      initials: `${g.nombre[0]}${g.apellido[0]}`.toUpperCase(),
    }));

    return mappedGuests.filter((guest) => {
      const matchesStatus =
        statusFilter === "ALL" || guest.status === statusFilter;
      const matchesSearch =
        guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.email.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [guestsData, statusFilter, searchQuery]);

  // KPIs dinámicos basados en filtros
  const kpis = useMemo(() => {
    const total = filteredGuests.length;
    const activeCheckIns = filteredGuests.filter(
      (g) => g.status === "ACTIVE",
    ).length;
    // Tasa lealtad simulada: huéspedes con más de 4 estancias
    const loyalCount = filteredGuests.filter((g) => g.totalStays >= 5).length;
    const loyaltyRate =
      total > 0 ? ((loyalCount / total) * 100).toFixed(1) : "0.0";

    // Estancia promedio calculada dinámicamente
    const avgStay =
      total > 0
        ? (
            filteredGuests.reduce((acc, curr) => acc + curr.totalStays, 0) /
              total /
              3 +
            2.5
          ).toFixed(1)
        : "0.0";

    return { total, activeCheckIns, loyaltyRate, avgStay };
  }, [filteredGuests]);

  const handleCreateGuest = () => {
    setIsCreateOpen(true);
  };

  const handleAddGuest = () => {
    // La mutación se encarga de invalidar y refrescar
    setIsCreateOpen(false);
  };

  const handleExportData = () => {
    toast.info("Exportación en curso", {
      description: "Generando archivo CSV del listado de huéspedes...",
    });
  };

  const handleViewDetails = (name: string) => {
    toast(`Ficha de Huésped: ${name}`, {
      description:
        "Cargando historial de reservas, preferencias dietéticas e historial de consumos de bar.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-10 w-10 text-brand-blue animate-spin" />
        <p className="text-sm font-medium text-dark-secondary italic animate-pulse">
          Sincronizando catálogo de huéspedes con el servidor...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Breadcrumbs superiores y Cabecera de Página */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-dark-secondary/60">
          <span>RECEPCIÓN</span>
          <span className="text-zinc-300 font-light">&gt;</span>
          <span className="text-brand-blue">GESTIÓN DE HUÉSPEDES</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-1">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-dark-primary">
              Gestión de Huéspedes
            </h2>
            <p className="text-dark-secondary text-sm max-w-2xl leading-relaxed">
              Controle los registros de huéspedes, supervise el historial de
              visitas y gestione el estado del ciclo de vida con precisión
              quirúrgica.
            </p>
          </div>

          <Button
            onClick={handleCreateGuest}
            className="bg-brand-blue hover:bg-blue-600 text-white font-semibold rounded-xl text-xs flex items-center gap-2 py-3.5 px-5 shadow-lg shadow-brand-blue/15 hover:shadow-brand-blue/25 transition-all duration-200 cursor-pointer w-fit self-start md:self-center"
          >
            <UserPlus2 className="h-4.5 w-4.5" />
            Nuevo Huésped
          </Button>
        </div>
      </div>

      {/* Grid de KPI Cards de 4 Columnas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1 */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col gap-1">
          <span className="text-[10px] font-extrabold text-dark-secondary/80 tracking-widest uppercase">
            Total Huéspedes
          </span>
          <span className="text-3xl font-extrabold text-brand-blue tracking-tight mt-1">
            {kpis.total === initialGuests.length ? "12.482" : kpis.total}
          </span>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col gap-1">
          <span className="text-[10px] font-extrabold text-dark-secondary/80 tracking-widest uppercase">
            Check-ins Activos
          </span>
          <span className="text-3xl font-extrabold text-brand-blue tracking-tight mt-1">
            {kpis.total === initialGuests.length ? "412" : kpis.activeCheckIns}
          </span>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col gap-1">
          <span className="text-[10px] font-extrabold text-dark-secondary/80 tracking-widest uppercase">
            Tasa de Lealtad
          </span>
          <span className="text-3xl font-extrabold text-brand-blue tracking-tight mt-1">
            {kpis.total === initialGuests.length
              ? "68.2%"
              : `${kpis.loyaltyRate}%`}
          </span>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col gap-1">
          <span className="text-[10px] font-extrabold text-dark-secondary/80 tracking-widest uppercase">
            Estancia Promedio
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-brand-blue tracking-tight">
              {kpis.total === initialGuests.length ? "4.2" : kpis.avgStay}
            </span>
            <span className="text-xs text-dark-secondary font-medium lowercase">
              noches
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 min-w-0">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 flex-1 min-w-0">
          {/* Búsqueda */}
          <div className="relative flex-1 max-w-sm min-w-0">
            <Search className="h-3.5 w-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-secondary/60" />
            <Input
              type="text"
              placeholder="Filtrar por nombre o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border-zinc-200 rounded-xl text-xs h-10 focus:border-brand-blue/30 transition-all shadow-xs w-full min-w-0"
            />
          </div>

          {/* Filtro de Estado */}
          <div className="flex bg-zinc-50 p-1 rounded-xl w-fit">
            {(["ALL", "ACTIVE", "INACTIVE"] as const).map((status) => {
              const isActive = statusFilter === status;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`text-[11px] font-bold px-3.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-white text-brand-blue shadow-xs"
                      : "text-dark-secondary hover:text-dark-primary hover:bg-zinc-100/30"
                  }`}
                >
                  {status === "ALL" ? "Todos los Estados" : status}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fecha y Descargas */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-10 px-4 rounded-xl border-zinc-200 bg-white text-dark-secondary hover:text-dark-primary flex items-center gap-2 text-xs font-semibold shadow-xs cursor-pointer"
            onClick={() => toast("Rango de fechas de estadía abierto")}
          >
            <Calendar className="h-4 w-4 text-dark-secondary/70" />
            Rango: Últimos 30 días
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-xl border-zinc-200 bg-white text-dark-secondary hover:text-dark-primary shadow-xs cursor-pointer"
            onClick={handleExportData}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Contenedor de la Tabla */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-100 text-[10px] font-bold text-dark-secondary/80 tracking-widest uppercase">
                <th className="pb-4 font-bold text-left">Nombre</th>
                <th className="pb-4 font-bold text-left">Email</th>
                <th className="pb-4 font-bold text-left">Último Check-in</th>
                <th className="pb-4 font-bold text-left">Total Estancias</th>
                <th className="pb-4 font-bold text-left">Estado</th>
                <th className="pb-4 font-bold text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.length > 0 ? (
                filteredGuests.map((guest) => (
                  <tr
                    key={guest.id}
                    className="border-b border-zinc-50 hover:bg-zinc-50/40 transition-colors last:border-0"
                  >
                    {/* Celda: Nombre */}
                    <td className="py-4.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-9 w-9 rounded-full ${guest.avatarBg} flex items-center justify-center font-bold text-xs shadow-xs`}
                        >
                          {guest.initials}
                        </div>
                        <span className="text-xs font-bold text-dark-primary">
                          {guest.name}
                        </span>
                      </div>
                    </td>

                    {/* Celda: Email */}
                    <td className="py-4.5 pr-4 text-xs font-medium text-dark-secondary">
                      {guest.email}
                    </td>

                    {/* Celda: Último Check-in */}
                    <td className="py-4.5 pr-4 text-xs font-medium text-dark-secondary">
                      {guest.lastCheckIn}
                    </td>

                    {/* Celda: Total Estancias */}
                    <td className="py-4.5 pr-4 text-xs font-bold text-dark-primary pl-6">
                      {guest.totalStays}
                    </td>

                    {/* Celda: Estado */}
                    <td className="py-4.5 pr-4">
                      {guest.status === "ACTIVE" ? (
                        <span className="inline-flex items-center gap-1 bg-brand-blue/5 text-brand-blue text-[10px] font-extrabold px-3 py-1 rounded-full border border-brand-blue/10">
                          <span className="h-1 w-1 rounded-full bg-brand-blue animate-pulse mr-1" />
                          ACTIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-zinc-100 text-zinc-500 text-[10px] font-extrabold px-3 py-1 rounded-full">
                          <span className="h-1 w-1 rounded-full bg-zinc-400 mr-1" />
                          INACTIVE
                        </span>
                      )}
                    </td>

                    {/* Celda: Acciones (Stack Vertical "Ver" y "Perfil") */}
                    <td className="py-4.5 text-right text-xs">
                      <div className="flex flex-col items-end gap-1.5 pl-4">
                        <button
                          onClick={() => handleViewDetails(guest.name)}
                          className="text-brand-blue hover:text-blue-700 font-bold hover:underline transition-colors cursor-pointer"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => handleViewDetails(guest.name)}
                          className="text-dark-secondary hover:text-dark-primary font-bold hover:underline transition-colors cursor-pointer text-[10px]"
                        >
                          Perfil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-xs font-medium text-dark-secondary"
                  >
                    No se encontraron huéspedes para los filtros activos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación de Tabla */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-zinc-100/60 text-xs text-dark-secondary select-none">
          <span>
            Mostrando 1-{filteredGuests.length} de{" "}
            {filteredGuests.length === initialGuests.length
              ? "1.240"
              : filteredGuests.length}{" "}
            resultados
          </span>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled
              className="h-8 px-3 rounded-lg border-zinc-200 text-zinc-400 cursor-not-allowed text-xs flex items-center gap-1 font-semibold"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Anterior
            </Button>

            <Button
              size="sm"
              className="h-8 w-8 rounded-lg bg-brand-blue hover:bg-blue-600 text-white font-bold text-xs"
            >
              1
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-lg hover:bg-zinc-100 text-dark-secondary hover:text-dark-primary font-bold text-xs"
              onClick={() => toast("Cargando página 2 de huéspedes...")}
            >
              2
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-lg hover:bg-zinc-100 text-dark-secondary hover:text-dark-primary font-bold text-xs"
              onClick={() => toast("Cargando página 3 de huéspedes...")}
            >
              3
            </Button>

            <span className="text-zinc-400 px-1 text-xs font-bold">...</span>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-lg hover:bg-zinc-100 text-dark-secondary hover:text-dark-primary font-bold text-xs"
              onClick={() => toast("Cargando página final...")}
            >
              124
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 rounded-lg border-zinc-200 text-dark-secondary hover:text-dark-primary cursor-pointer text-xs flex items-center gap-1 font-semibold"
              onClick={() => toast("Cargando página siguiente de huéspedes...")}
            >
              Siguiente
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Grid de Reportes de Inteligencia y Actividad Reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Perspectivas de Inteligencia */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2.5 text-brand-blue font-bold text-xs tracking-wider uppercase">
            <div className="bg-brand-blue/10 p-2 rounded-xl text-brand-blue">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            Perspectivas de Inteligencia
          </div>
          <p className="text-dark-primary text-xs leading-relaxed font-medium">
            La IA sugiere contactar a{" "}
            <span className="text-brand-blue font-bold cursor-pointer hover:underline">
              Alex Thompson
            </span>{" "}
            para actualizar su programa de lealtad. Ha superado las 15 estancias
            este trimestre.
          </p>
        </div>

        {/* Card 2: Actividad Reciente */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2.5 text-brand-blue font-bold text-xs tracking-wider uppercase">
            <div className="bg-brand-blue/10 p-2 rounded-xl text-brand-blue">
              <Clock className="h-4.5 w-4.5" />
            </div>
            Actividad Reciente
          </div>

          <div className="flex flex-col gap-3 pt-1">
            <div className="flex justify-between items-center text-xs border-b border-zinc-50 pb-2.5 last:border-0 last:pb-0">
              <span className="text-dark-primary font-medium">
                Nuevo Huésped registrado:{" "}
                <span className="font-bold">Sarah Jansens</span>
              </span>
              <span className="text-[10px] text-dark-secondary/60 font-semibold">
                hace 2h
              </span>
            </div>
            <div className="flex justify-between items-center text-xs pb-0">
              <span className="text-dark-primary font-medium">
                Check-out finalizado:{" "}
                <span className="font-bold">Marcus Weber</span>
              </span>
              <span className="text-[10px] text-dark-secondary/60 font-semibold">
                hace 5h
              </span>
            </div>
          </div>
        </div>
      </div>

      <CreateGuestDialog isOpen={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
