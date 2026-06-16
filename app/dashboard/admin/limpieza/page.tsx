"use client";

import { useMemo, useState } from "react";
import { 
  Search, 
  CheckCheck, 
  Clock, 
  AlertTriangle,
  Plus,
  RefreshCw,
  User,
  LayoutGrid
} from "lucide-react";
import { useGetRoomsQuery } from "@/modules/room/domain/hooks/useRoomQueries";
import { useUpdateRoomMutation } from "@/modules/room/domain/hooks/useRoomMutations";
import { useGetLimpiezasQuery } from "@/modules/room/domain/hooks/useLimpiezaQueries";
import { useGetTodasIncidenciasQuery } from "@/modules/room/domain/hooks/useIncidenciaQueries";
import { useGetCommonAreasQuery } from "@/modules/common-area/domain/hooks/useCommonAreaQueries";
import { useUpdateCommonAreaMutation } from "@/modules/common-area/domain/hooks/useCommonAreaMutations";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { AssignLimpiezaDialog } from "@/presentation/dashboard/admin/rooms/assign-limpieza-dialog/index";
import { EditLimpiezaDialog } from "@/presentation/dashboard/admin/rooms/edit-limpieza-dialog";
import { Room, RegistroLimpieza, Incidencia } from "@/core/room/interfaces";
import { CommonArea } from "@/core/common-area/interfaces";

type CleaningItem = {
  type: 'ROOM' | 'AREA';
  id: string | number;
  data: Room | CommonArea;
};

export default function LimpiezaPage() {
  const { data: rooms = [], isLoading: isLoadingRooms } = useGetRoomsQuery();
  const { data: commonAreas = [], isLoading: isLoadingAreas } = useGetCommonAreasQuery();
  const { data: limpiezas = [], isLoading: isLoadingLimpiezas, refetch } = useGetLimpiezasQuery();
  const { data: incidencias = [] } = useGetTodasIncidenciasQuery();

  const updateRoom = useUpdateRoomMutation();
  const updateArea = useUpdateCommonAreaMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("TODOS");
  const [selectedLimpieza, setSelectedLimpieza] = useState<RegistroLimpieza | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Estado para el AlertDialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemToConfirm, setItemToConfirm] = useState<CleaningItem | null>(null);

  // Combinar y filtrar datos
  const filteredItems = useMemo(() => {
    const combined: CleaningItem[] = [
      ...rooms.map(room => ({ type: 'ROOM' as const, id: `room-${room.id}`, data: room })),
      ...commonAreas.map(area => ({ type: 'AREA' as const, id: `area-${area.id}`, data: area }))
    ];

    return combined.filter((item) => {
      const isRoom = item.type === 'ROOM';
      const room = isRoom ? (item.data as Room) : null;
      const area = !isRoom ? (item.data as CommonArea) : null;

      const nameToSearch = isRoom 
        ? `${room?.numero} ${room?.tipo_display} ${room?.planta_details?.nombre}`
        : `${area?.nombre} ${area?.categoria} ${area?.sede_details?.nombre}`;
      
      const matchesSearch = nameToSearch.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      const estado = isRoom ? room?.estado : area?.estado;

      if (activeFilter === "TODOS") return true;
      if (activeFilter === "SUCIA") return estado === "SUCIA";
      if (activeFilter === "EN PROGRESO") return estado === "LIMPIEZA" || (isRoom && room?.estado === "LIMPIEZA");
      
      if (activeFilter === "INSPECCIONADA") {
        if (!isRoom) return false; // Por ahora las áreas no tienen inspección en el modelo
        const limpieza = limpiezas.find(l => l.habitacion === room?.id);
        return limpieza?.estado === "INSPECCIONADO";
      }

      return true;
    });
  }, [rooms, commonAreas, limpiezas, searchQuery, activeFilter]);

  if (isLoadingRooms || isLoadingLimpiezas || isLoadingAreas) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }


  const handleUpdateStatus = (limpieza: RegistroLimpieza) => {
    setSelectedLimpieza(limpieza);
    setIsEditDialogOpen(true);
  };

  const handleOpenConfirm = (item: CleaningItem) => {
    setItemToConfirm(item);
    setConfirmOpen(true);
  };

  const handleConfirmAction = () => {
    if (!itemToConfirm) return;

    if (itemToConfirm.type === 'ROOM') {
      updateRoom.mutate({ id: itemToConfirm.data.id, estado: 'DISPONIBLE' });
    } else {
      updateArea.mutate({ id: itemToConfirm.data.id, estado: 'DISPONIBLE' });
    }
    setConfirmOpen(false);
    setItemToConfirm(null);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-20 px-4">
      {/* Header */}
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-4xl font-bold text-dark-primary tracking-tighter">
          Estados de <span className="text-brand-blue">Limpieza</span>
        </h1>
        <p className="text-sm font-medium text-dark-secondary">
          Monitoreo en tiempo real de habitaciones y áreas comunes del hotel.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-6">
        <Input
          placeholder="Buscar habitaciones o áreas comunes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startContent={<Search className="h-5 w-5" />}
          className="h-14 bg-white border-none rounded-[1.5rem] shadow-xs"
        />

        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {["TODOS", "SUCIA", "EN PROGRESO", "INSPECCIONADA"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-8 py-3 rounded-full text-xs font-bold transition-all whitespace-nowrap",
                activeFilter === filter
                  ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20"
                  : "bg-white/60 text-dark-secondary hover:bg-white transition-colors"
              )}
            >
              {filter.charAt(0) + filter.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Habitaciones y Áreas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredItems.map((item) => {
          if (item.type === 'ROOM') {
            const room = item.data as Room;
            const limpieza = limpiezas.find(l => l.habitacion === room.id && (l.estado === 'EN_PROGRESO' || l.estado === 'INSPECCIONADO'));
            const incidencia = incidencias.find(i => i.habitacion === room.id && i.estado !== 'RESUELTO');
            
            return (
              <RoomCleaningCard 
                key={item.id} 
                room={room} 
                limpieza={limpieza}
                incidencia={incidencia}
                onMarkClean={() => handleOpenConfirm(item)}
                onUpdate={() => limpieza && handleUpdateStatus(limpieza)}
              />
            );
          } else {
            const area = item.data as CommonArea;
            const incidencia = incidencias.find(i => i.area_comun === area.id && i.estado !== 'RESUELTO');
            return (
              <AreaCleaningCard
                key={item.id}
                area={area}
                incidencia={incidencia}
                onMarkClean={() => handleOpenConfirm(item)}
              />
            );
          }
        })}
      </div>

      {/* AlertDialog de Confirmación */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="rounded-[2rem] border-none p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-dark-primary tracking-tighter">
              ¿Confirmar limpieza?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-dark-secondary font-medium">
              Estás a punto de marcar{" "}
              <span className="font-bold text-brand-blue">
                {itemToConfirm?.type === 'ROOM' 
                  ? `la habitación ${(itemToConfirm.data as Room)?.numero}` 
                  : `el área ${(itemToConfirm?.data as CommonArea)?.nombre}`}
              </span>{" "}
              como disponible. Esta acción notificará a recepción que el espacio está listo para su uso.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-6">
            <AlertDialogCancel className="rounded-2xl border-zinc-100 font-bold hover:bg-zinc-50 text-dark-secondary">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmAction}
              className="rounded-2xl bg-brand-blue hover:bg-blue-600 font-bold text-white shadow-lg shadow-brand-blue/20"
            >
              Sí, marcar disponible
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedLimpieza && (
        <EditLimpiezaDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          limpieza={selectedLimpieza}
        />
      )}
    </div>
  );
}

// --- COMPONENTES DE CARTAS ---

interface RoomCleaningCardProps {
  room: Room;
  limpieza?: RegistroLimpieza;
  incidencia?: Incidencia;
  onMarkClean: () => void;
  onUpdate: () => void;
}

function RoomCleaningCard({ room, limpieza, incidencia, onMarkClean, onUpdate }: RoomCleaningCardProps) {
  const getStatusInfo = () => {
    if (room.estado === "MANTENIMIENTO") {
      return { 
        label: "Mantenimiento", 
        color: "bg-zinc-100 text-zinc-500",
        icon: AlertTriangle,
      };
    }
    if (limpieza?.estado === "INSPECCIONADO") {
       return { 
        label: "Inspeccionada", 
        color: "bg-[#e2fbe8] text-[#00723a]",
        icon: CheckCheck,
      };
    }
    if (room.estado === "LIMPIEZA") {
      return { 
        label: "En Progreso", 
        color: "bg-amber-50 text-amber-600",
        icon: RefreshCw,
      };
    }
    if (room.estado === "SUCIA") {
      return { 
        label: "Sucia", 
        color: "bg-red-50 text-red-600",
        icon: Clock,
      };
    }
    return { 
      label: "Limpia", 
      color: "bg-blue-50 text-brand-blue",
      icon: CheckCheck,
    };
  };

  const status = getStatusInfo();
  const StatusIcon = status.icon;

  const renderContent = () => {
    if (room.estado === "SUCIA") {
      return (
        <div className="flex flex-col gap-4 mt-auto">
          <div className="flex items-center gap-2 text-red-600/70 font-bold text-xs uppercase tracking-tighter">
            <Clock className="h-4 w-4" />
            <span>SALIDA: 11:00 AM</span>
          </div>
          <Button 
            onClick={onMarkClean}
            className="w-full h-14 bg-brand-blue hover:bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-brand-blue/10"
          >
            Marcar como Limpia
          </Button>
        </div>
      );
    }

    if (room.estado === "LIMPIEZA") {
      return (
        <div className="flex flex-col gap-4 mt-auto">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
               <User className="h-5 w-5" />
             </div>
             <div className="flex-1 flex flex-col gap-1.5">
                <span className="text-xs font-bold text-dark-primary leading-none">
                  {limpieza?.personal_limpieza_details?.full_name || "Personal Asignado"}
                </span>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[65%] rounded-full" />
                  </div>
                  <span className="text-[10px] font-black text-amber-600">65%</span>
                </div>
             </div>
          </div>
          <p className="text-[11px] text-dark-secondary italic leading-relaxed line-clamp-2 px-1">
            "{limpieza?.observaciones || "Limpieza profunda de azulejos en el baño y reposición de mini-bar..."}"
          </p>
          <div className="text-[10px] font-bold text-dark-secondary/60 uppercase tracking-widest pl-1">
             Asignado hace 12 min
          </div>
        </div>
      );
    }

    if (limpieza?.estado === "INSPECCIONADO") {
      return (
        <div className="p-4 rounded-[1.5rem] bg-[#f1fdf4] border border-[#e2fbe8] flex flex-col gap-3 mt-auto">
           <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[#00723a] text-white flex items-center justify-center text-[10px] font-bold shadow-sm shadow-[#00723a]/20">RM</div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#00723a] leading-none">Robert Miller</span>
                <span className="text-[9px] font-bold text-[#00723a]/60 uppercase tracking-tighter">SUPERVISOR CCTV</span>
              </div>
           </div>
           <p className="text-[10px] text-[#00723a]/80 font-semibold leading-snug">
              "Control de calidad aprobado. Amenidades VIP preparadas y verificadas."
           </p>
           <div className="flex items-center gap-1.5 text-[10px] font-black text-[#00723a] uppercase tracking-tighter border-t border-[#00723a]/10 pt-2 mt-1">
              <CheckCheck className="h-4 w-4" />
              Listo para el check-in
           </div>
        </div>
      );
    }

    if (room.estado === "MANTENIMIENTO") {
      return (
        <div className="flex flex-col gap-4 mt-auto">
          <div className="flex items-center gap-3">
             <div className="h-10 w-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400">
               <AlertTriangle className="h-5 w-5" />
             </div>
             <div className="flex flex-col">
                <span className="text-xs font-bold text-dark-primary">Incidencia Reportada</span>
                <span className="text-[10px] font-medium text-dark-secondary tracking-tight">Limpieza pospuesta hasta reparación</span>
             </div>
          </div>
          <Button 
            variant="outline"
            className="w-full h-12 border-zinc-100 hover:bg-zinc-50 text-dark-primary rounded-2xl font-bold text-xs uppercase tracking-widest"
          >
            Actualizar Estado
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2 mt-auto">
        <div className="text-[11px] font-bold text-zinc-400">
          Última limpieza: <span className="text-dark-secondary uppercase">12:45 PM</span>
        </div>
        <button className="text-[11px] font-black text-brand-blue hover:underline uppercase tracking-widest text-left">
          VER DETALLES
        </button>
      </div>
    );
  };

  return (
    <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-sm group hover:shadow-2xl hover:shadow-brand-blue/10 transition-all duration-500 h-[480px] flex flex-col">
      <div className="p-8 flex flex-col h-full">
        {/* Top Info */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">
            {room.planta_details?.nombre} - {room.tipo_display}
          </span>
          <Badge className={cn("rounded-full px-4 py-1.5 border-none text-[10px] font-black flex items-center gap-2 shadow-sm", status.color)}>
            <StatusIcon className="h-3 w-3 stroke-[3]" />
            {status.label.toUpperCase()}
          </Badge>
        </div>

        <h3 className="text-5xl font-bold text-dark-primary tracking-tighter mb-6 group-hover:scale-110 transition-transform origin-left">{room.numero}</h3>

        {/* Thumbnail */}
        <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden bg-zinc-100 mb-8 shadow-inner">
          <img 
            src={`https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=600`} 
            alt="Room View"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Dynamic Content Area */}
        {renderContent()}
      </div>
    </Card>
  );
}

function AreaCleaningCard({ area, incidencia, onMarkClean }: { area: CommonArea, incidencia?: Incidencia, onMarkClean: () => void }) {
  const isDirty = area.estado === "SUCIA";
  
  return (
    <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-sm group hover:shadow-2xl hover:shadow-brand-blue/10 transition-all duration-500 h-[480px] flex flex-col">
      <div className="p-8 flex flex-col h-full">
        {/* Top Info */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">
            {area.sede_details?.nombre} - {area.categoria || 'ÁREA COMÚN'}
          </span>
          <Badge className={cn(
            "rounded-full px-4 py-1.5 border-none text-[10px] font-black flex items-center gap-2 shadow-sm",
            isDirty ? "bg-red-50 text-red-600" : "bg-blue-50 text-brand-blue"
          )}>
            {isDirty ? <Clock className="h-3 w-3 stroke-[3]" /> : <CheckCheck className="h-3 w-3 stroke-[3]" />}
            {area.estado.toUpperCase()}
          </Badge>
        </div>

        <h3 className="text-3xl font-black text-dark-primary tracking-tighter mb-6 group-hover:scale-105 transition-transform origin-left line-clamp-2 leading-none">
          {area.nombre}
        </h3>

        {/* Thumbnail */}
        <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden bg-zinc-100 mb-8 shadow-inner">
          <img 
            src={area.imagen || `https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600`} 
            alt={area.nombre}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-brand-blue shadow-lg">
             <LayoutGrid className="h-5 w-5" />
          </div>
        </div>

        {/* Dynamic Content Area */}
        {isDirty ? (
          <div className="flex flex-col gap-4 mt-auto">
            {incidencia && (
              <div className="flex items-center gap-2 text-red-600/70 font-bold text-[10px] uppercase tracking-tighter">
                <AlertTriangle className="h-3 w-3" />
                <span>ID: {incidencia.id} - {incidencia.titulo}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-red-600/70 font-bold text-xs uppercase tracking-tighter">
              <Clock className="h-4 w-4" />
              <span>Estado: Requiere Atención</span>
            </div>
            <Button 
              onClick={onMarkClean}
              className="w-full h-14 bg-[#1a1f2c] hover:bg-black text-white rounded-2xl font-bold text-sm shadow-lg shadow-black/10"
            >
              Finalizar Limpieza
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-auto">
            <div className="text-[11px] font-bold text-zinc-400">
              Estado: <span className="text-dark-secondary uppercase">{area.estado_display || 'DISPONIBLE'}</span>
            </div>
            <button className="text-[11px] font-black text-brand-blue hover:underline uppercase tracking-widest text-left">
              DETALLES DEL ÁREA
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}