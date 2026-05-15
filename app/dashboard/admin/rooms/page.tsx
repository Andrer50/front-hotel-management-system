"use client";

import { useState, useMemo } from "react";
import {
  BedDouble,
  RefreshCw,
  Download,
  Brush,
  AlertTriangle,
  User,
  Search,
  Check,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useGetRoomsQuery } from "@/modules/room/domain/hooks/useRoomQueries";
import { useGetPlantasQuery } from "@/modules/room/domain/hooks/usePlantaQueries";
import { Loader2, Plus, PlusCircle } from "lucide-react";
import { CreateRoomDialog } from "@/presentation/dashboard/admin/rooms/create-room-dialog";
import { CreatePlantaDialog } from "@/presentation/dashboard/admin/rooms/create-planta-dialog";
import { UpdateRoomDialog } from "@/presentation/dashboard/admin/rooms/update-room-dialog";
import { Room, RoomEstado } from "@/core/room/interfaces";

export default function RoomsManagementPage() {
  const { data: roomsData = [], isLoading: isLoadingRooms } =
    useGetRoomsQuery();
  const { data: plantas = [], isLoading: isLoadingPlantas } =
    useGetPlantasQuery();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreatePlantaDialogOpen, setIsCreatePlantaDialogOpen] =
    useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const [selectedFloor, setSelectedFloor] = useState<string | "ALL">("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtros dinámicos basados directamente en la interfaz del Core
  const filteredRooms = useMemo(() => {
    return roomsData.filter((room) => {
      const matchesFloor =
        selectedFloor === "ALL" || room.planta?.toString() === selectedFloor;

      // Mapeo simple para filtros de UI
      const uiStatus: RoomEstado = room.estado;

      const matchesType =
        typeFilter === "ALL" ||
        room.tipo === typeFilter ||
        room.tipo_display === typeFilter;
      const matchesStatus = statusFilter === "ALL" || uiStatus === statusFilter;
      const matchesSearch =
        room.numero.includes(searchQuery) ||
        (room.tipo_display || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      return matchesFloor && matchesType && matchesStatus && matchesSearch;
    });
  }, [roomsData, selectedFloor, typeFilter, statusFilter, searchQuery]);

  // Totales calculados para KPIs basados en la respuesta real
  const stats = useMemo(() => {
    const total = roomsData.length;
    const ocupadas = roomsData.filter((r) => r.estado === "OCUPADA").length;
    const vacantes = total - ocupadas;
    const listas = roomsData.filter((r) => r.estado === "DISPONIBLE").length;
    const listasPercentage = total > 0 ? Math.round((listas / total) * 100) : 0;
    const enLimpieza = roomsData.filter((r) => r.estado === "SUCIA").length;

    return { total, ocupadas, vacantes, listas, listasPercentage, enLimpieza };
  }, [roomsData]);

  const handleUpdateStatus = () => {
    toast.success("Estados de Habitación Sincronizados", {
      description:
        "Se han actualizado las lecturas de sensores de ocupación y tarjetas IoT.",
    });
  };

  const handleExportReport = () => {
    toast.info("Generando Reporte de Gobernanza", {
      description:
        "Exportando planilla de limpieza para camareras en formato PDF...",
    });
  };

  const getStatusStyles = (status: RoomEstado | string) => {
    switch (status) {
      case "DISPONIBLE":
        return {
          badge: "bg-[#e2fbe8] text-[#00723a]",
          border: "#00723a",
          label: "Vacante",
        };
      case "OCUPADA":
        return {
          badge: "bg-zinc-100 text-zinc-600",
          border: "#64748b",
          label: "Ocupado",
        };
      case "LIMPIEZA":
        return {
          badge: "bg-blue-50 text-brand-blue",
          border: "#095fe5",
          label: "En Limpieza",
        };
      case "MANTENIMIENTO":
        return {
          badge: "bg-red-50 text-red-600",
          border: "#ef4444",
          label: "Fuera de Servicio",
        };
      case "SUCIA":
      default:
        return {
          badge: "bg-amber-50 text-amber-600",
          border: "#f59e0b",
          label: "Sucia",
        };
    }
  };

  const handleRoomClick = (roomNumber: string, status: string) => {
    toast(`Detalle de Habitación ${roomNumber}`, {
      description: `Estado: ${status}. Abriendo bitácora histórica de mantenimiento y ama de llaves.`,
    });
  };

  if (isLoadingRooms || isLoadingPlantas) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Cabecera y Botones de Acción */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-extrabold tracking-tight text-dark-primary">
            Mantenimiento de Habitaciones
          </h2>
          <p className="text-dark-secondary text-sm max-w-2xl leading-relaxed">
            Estado en tiempo real de limpieza y preparación de habitaciones.
          </p>
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
            Nueva Habitación
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

      {/* Grid de KPI Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* KPI 1 (Inventario Total - Spans 2 cols) */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs lg:col-span-2 flex justify-between items-center relative overflow-hidden min-h-[125px]">
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-dark-secondary/80 tracking-widest uppercase">
              Inventario Total
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold text-dark-primary tracking-tight">
                {stats.total}
              </span>
              <span className="text-xs font-semibold text-dark-secondary">
                Habitaciones
              </span>
            </div>

            <div className="flex items-center gap-6 mt-4 text-[11px] font-bold">
              <div className="flex items-center gap-2 text-dark-secondary">
                <span className="h-2 w-2 rounded-full bg-zinc-300" />
                OCUPADAS:{" "}
                <span className="text-dark-primary">{stats.ocupadas}</span>
              </div>
              <div className="flex items-center gap-2 text-dark-secondary">
                <span className="h-2 w-2 rounded-full bg-brand-blue" />
                VACANTES:{" "}
                <span className="text-dark-primary">{stats.vacantes}</span>
              </div>
            </div>
          </div>

          {/* Icono de plano de habitación o cama */}
          <div className="text-zinc-100 pr-4 hidden sm:block">
            <BedDouble className="h-16 w-16 stroke-[1.2]" />
          </div>
        </div>

        {/* KPI 2 (Habitaciones Listas) */}
        <div className="bg-[#e2fbe8] border border-[#cbf7d5] rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-[125px] text-[#00723a]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#00723a]/80">
              {stats.listasPercentage}% Lista
            </span>
            <Check className="h-4 w-4 stroke-[2.5]" />
          </div>
          <div className="flex flex-col mt-2">
            <span className="text-4xl font-extrabold tracking-tight">
              {stats.listas}
            </span>
            <span className="text-[10px] font-bold uppercase mt-1 tracking-wider">
              Lista para Huésped
            </span>
          </div>
        </div>

        {/* KPI 3 (En Limpieza) */}
        <div className="bg-[#e6f0ff] border border-[#ccdfff] rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-[125px] text-brand-blue">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold tracking-widest uppercase text-brand-blue/80">
              % Activo
            </span>
            <Brush className="h-4 w-4" />
          </div>
          <div className="flex flex-col mt-2">
            <span className="text-4xl font-extrabold tracking-tight">
              {stats.enLimpieza}
            </span>
            <span className="text-[10px] font-bold uppercase mt-1 tracking-wider">
              En Limpieza
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Navegación por Planta y Filtros */}
      <div className="flex flex-col gap-5 bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs">
        {/* Selector de Plantas */}
        <div className="flex border-b border-zinc-100 pb-1.5 overflow-x-auto gap-2">
          <button
            onClick={() => setSelectedFloor("ALL")}
            className={`px-4 py-4 text-xs font-bold transition-all relative ${
              selectedFloor === "ALL"
                ? "text-blue-600"
                : "text-dark-secondary hover:text-dark-primary"
            }`}
          >
            Todas las plantas
            {selectedFloor === "ALL" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>

          {plantas.map((planta) => (
            <button
              key={planta.id}
              onClick={() => setSelectedFloor(planta.id.toString())}
              className={`px-4 py-4 text-xs font-bold transition-all relative ${
                selectedFloor === planta.id.toString()
                  ? "text-blue-600"
                  : "text-dark-secondary hover:text-dark-primary"
              }`}
            >
              {planta.nombre}
              {selectedFloor === planta.id.toString() && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}

          {/* Botón para Añadir Planta */}
          <button
            onClick={() => setIsCreatePlantaDialogOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 ml-2 my-auto text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100/50"
            title="Crear Nueva Planta"
          >
            <PlusCircle className="h-3 w-3" />
            NUEVA PLANTA
          </button>
        </div>

        {/* Selectores de Tipo y Estado */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[11px] font-bold text-dark-secondary">
              Filtrar por:
            </span>

            <div className="w-44">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-9 text-[11px] font-bold rounded-xl border-zinc-100 bg-zinc-50/50">
                  <span className="text-dark-secondary mr-1">Tipo:</span>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                  <SelectItem value="DOBLE">Doble</SelectItem>
                  <SelectItem value="SUITE">Suite</SelectItem>
                  <SelectItem value="FAMILIAR">Familiar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-44">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 text-[11px] font-bold rounded-xl border-zinc-100 bg-zinc-50/50">
                  <span className="text-dark-secondary mr-1">Estado:</span>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="DISPONIBLE">Lista / Vacante</SelectItem>
                  <SelectItem value="OCUPADA">Ocupada</SelectItem>
                  <SelectItem value="SUCIA">Sucia</SelectItem>
                  <SelectItem value="LIMPIEZA">En Limpieza</SelectItem>
                  <SelectItem value="MANTENIMIENTO">Mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-dark-secondary/60" />
            <Input
              type="text"
              placeholder="Buscar habitación..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-white border-zinc-200 rounded-xl text-xs h-9"
            />
          </div>
        </div>

        {/* Grid de Tarjetas de Habitaciones */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-2">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => {
              // Cálculos al vuelo para mantener la interfaz del Core intacta
              const uiStatus = room.estado;

              return (
                <div
                  key={room.id}
                  onClick={() => {
                    setSelectedRoom(room);
                    setIsUpdateDialogOpen(true);
                  }}
                  className="bg-white border border-zinc-100 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[140px] group border-t-2"
                  style={{
                    borderTopColor: getStatusStyles(uiStatus).border,
                  }}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-black text-dark-primary group-hover:text-brand-blue transition-colors">
                      {room.numero}
                    </span>

                    {/* Badge de Estado */}
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-md ${
                        getStatusStyles(uiStatus).badge
                      }`}
                    >
                      {uiStatus === "DISPONIBLE" ? "LISTA" : uiStatus}
                    </span>
                  </div>

                  <div className="flex flex-col gap-0.5 mt-3">
                    <span className="text-[11px] font-extrabold text-dark-primary truncate">
                      {room.tipo_display || room.tipo}
                    </span>

                    {/* Estado de Ocupación o Notas */}
                    <div className="flex items-center gap-1.5 mt-2 text-[10px] text-dark-secondary font-semibold">
                      {uiStatus === "DISPONIBLE" && (
                        <span className="flex items-center gap-1.5 text-emerald-600">
                          <User className="h-3 w-3 opacity-60" />
                          Vacante
                        </span>
                      )}

                      {uiStatus === "OCUPADA" && (
                        <span className="flex items-center gap-1.5 text-zinc-600">
                          <User className="h-3 w-3 opacity-60" />
                          Ocupada
                        </span>
                      )}

                      {uiStatus === "LIMPIEZA" && (
                        <div className="flex flex-col gap-1 w-full">
                          <span className="flex items-center gap-1 text-brand-blue font-bold">
                            <Brush className="h-3 w-3 opacity-60" />
                            En Limpieza...
                          </span>
                          <div className="w-full bg-zinc-100 h-1 rounded-full overflow-hidden mt-1">
                            <div
                              className="bg-brand-blue h-full rounded-full animate-pulse"
                              style={{ width: "65%" }}
                            />
                          </div>
                        </div>
                      )}

                      {uiStatus === "SUCIA" && (
                        <span className="flex items-center gap-1.5 text-amber-600 font-bold">
                          <AlertTriangle className="h-3 w-3 opacity-60" />
                          Sucia
                        </span>
                      )}

                      {uiStatus === "MANTENIMIENTO" && (
                        <span className="flex items-center gap-1.5 text-red-600 font-bold">
                          <Settings2 className="h-3 w-3 opacity-60" />
                          Mantenimiento
                        </span>
                      )}

                      {uiStatus === "SUCIA" && (
                        <span className="flex items-center gap-1 text-slate-500 font-bold">
                          <User className="h-3 w-3 opacity-60" />
                          Ocupado
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center text-xs font-semibold text-dark-secondary">
              No se encontraron habitaciones para el filtro seleccionado.
            </div>
          )}
        </div>
      </div>

      {/* Grid Inferior (Asignaciones & Alertas de Mantenimiento) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Asignaciones de Limpieza */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-[220px]">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-dark-primary">
                Asignaciones de Limpieza
              </h3>
              <button
                onClick={() =>
                  toast("Cargando plantilla de asignaciones de personal...")
                }
                className="text-xs font-bold text-brand-blue hover:underline cursor-pointer"
              >
                | Asignar Personal
              </button>
            </div>
            <p className="text-[11px] font-semibold text-dark-secondary leading-relaxed">
              Distribución para el turno de mañana (08:00 - 16:00)
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            {/* Fila 1 */}
            <div className="flex items-center justify-between border-b border-zinc-50 pb-3 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center font-bold text-xs shadow-2xs">
                  MG
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-dark-primary leading-tight">
                    Maria Garcia
                  </span>
                  <span className="text-[10px] font-semibold text-dark-secondary/70 mt-0.5">
                    Zona A • Planta 1
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-dark-primary">
                  12 / 18 Habitaciones
                </span>
                <span className="bg-emerald-50 text-[#00723a] text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-emerald-100">
                  Activa
                </span>
              </div>
            </div>

            {/* Fila 2 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-xs shadow-2xs">
                  LD
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-dark-primary leading-tight">
                    Líria Doe
                  </span>
                  <span className="text-[10px] font-semibold text-dark-secondary/70 mt-0.5">
                    Zona B • Planta 2
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-dark-primary">
                  4 / 15 Habitaciones
                </span>
                <span className="bg-blue-50 text-brand-blue text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-blue-100">
                  En descanso
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Alertas de Mantenimiento */}
        <div className="bg-[#111827] text-white rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-[220px]">
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-extrabold tracking-tight">
              Alertas de Mantenimiento
            </h3>
            <p className="text-[11px] font-semibold text-zinc-400">
              Problemas prioritarios que requieren atención.
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-3">
            {/* Alerta 1 */}
            <div className="flex items-start gap-3">
              <div className="h-7 w-7 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">
                  Fuga de agua - Hab. 304
                </span>
                <span className="text-[10px] font-semibold text-zinc-400 mt-0.5">
                  Reportado hace 12m • Ingeniería notificada
                </span>
              </div>
            </div>

            {/* Alerta 2 */}
            <div className="flex items-start gap-3">
              <div className="h-7 w-7 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                2
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">
                  Cambio de bombilla - Pasillo 2
                </span>
                <span className="text-[10px] font-semibold text-zinc-400 mt-0.5">
                  Reportado hace 45m • Asignado a Carlos
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => toast("Redirigiendo a panel de ingeniería...")}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-extrabold text-xs py-3 rounded-xl transition-all mt-4 cursor-pointer"
          >
            Abrir Portal de Mantenimiento
          </button>
        </div>
      </div>
      <CreateRoomDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
      <CreatePlantaDialog
        isOpen={isCreatePlantaDialogOpen}
        onOpenChange={setIsCreatePlantaDialogOpen}
      />
      <UpdateRoomDialog
        key={selectedRoom?.id || "none"}
        isOpen={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        room={selectedRoom}
      />
    </div>
  );
}
