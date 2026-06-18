"use client";

import { useState } from "react";
import {
  Plus,
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Filter,
  MoreHorizontal,
  MapPin,
  Calendar,
  User,
  ArrowUpRight,
  PowerOff,
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
import {
  useGetCommonAreasQuery,
} from "@/modules/common-area/domain/hooks/useCommonAreaQueries";
import { useDeleteCommonAreaMutation } from "@/modules/common-area/domain/hooks/useCommonAreaMutations";
import { CommonArea, CommonAreaEstado } from "@/core/common-area/interfaces";
import { CreateCommonAreaDialog } from "@/presentation/dashboard/admin/common-areas/create-common-area-dialog";
import { UpdateCommonAreaDialog } from "@/presentation/dashboard/admin/common-areas/update-common-area-dialog";
import { useGetAforosQuery } from "@/modules/common-area/domain/hooks/useAforoQueries";
import { RegistroAforo } from "@/core/common-area/interfaces";
import { CreateAforoDialog } from "@/presentation/dashboard/admin/common-areas/create-aforo-dialog";
import { ManageAforoDialog } from "@/presentation/dashboard/admin/common-areas/manage-aforo-dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function CommonAreasPage() {
  const { data: areas = [], isLoading } = useGetCommonAreasQuery();
  const { mutate: deleteArea } = useDeleteCommonAreaMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  // Nuevo estado para el filtro de activación
  const [activeFilter, setActiveFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<CommonArea | null>(null);
  const { data: aforos = [], isLoading: isLoadingAforos } = useGetAforosQuery();
  const [isCreateAforoOpen, setIsCreateAforoOpen] = useState(false);
  const [isManageAforoOpen, setIsManageAforoOpen] = useState(false);
  const [selectedAforo, setSelectedAforo] = useState<RegistroAforo | null>(null);

  const categories = ["Todos", "Interiores", "Exteriores"];

  // Filtro inteligente actualizado
  const filteredAreas = areas.filter((area) => {
    const matchesSearch = area.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "Todos" || area.categoria === categoryFilter;
    const matchesActive =
      activeFilter === "ALL" ||
      (activeFilter === "ACTIVE" && area.is_active) ||
      (activeFilter === "INACTIVE" && !area.is_active);
      
    return matchesSearch && matchesCategory && matchesActive;
  });

  const getStatusConfig = (status: CommonAreaEstado) => {
    switch (status) {
      case "DISPONIBLE":
        return { color: "bg-emerald-50 text-emerald-600", label: "OPERATIVO", dot: "bg-emerald-500" };
      case "OCUPADA":
        return { color: "bg-zinc-100 text-zinc-600", label: "OCUPADA", dot: "bg-zinc-500" };
      case "SUCIA":
        return { color: "bg-amber-50 text-amber-600", label: "SUCIA", dot: "bg-amber-500" };
      case "MANTENIMIENTO":
        return { color: "bg-red-50 text-red-600", label: "EN MTTO.", dot: "bg-red-500" };
      case "RESTRINGIDO":
        return { color: "bg-slate-100 text-slate-600", label: "RESTRINGIDO", dot: "bg-slate-500" };
      default:
        return { color: "bg-zinc-50 text-zinc-400", label: "DESCONOCIDO", dot: "bg-zinc-300" };
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta área?")) {
      deleteArea(id);
      setIsUpdateOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 space-y-8 pb-24">
      {/* Header Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Status Card */}
        <div className="lg:col-span-2 bg-[#0051b3] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
          <div className="relative z-10 flex justify-between items-start">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Estado Global</span>
                <h2 className="text-3xl font-bold tracking-tight">Mantenimiento de Áreas</h2>
              </div>
              <p className="text-blue-100/80 text-sm font-medium max-w-[240px] leading-relaxed">
                Optimización constante para su bienestar residencial.
              </p>
            </div>
            <div className="text-7xl font-bold tracking-tighter opacity-90">84%</div>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
        </div>

        {/* Next Shift Card */}
        <div className="bg-white rounded-[2rem] p-8 flex flex-col justify-center items-center text-center space-y-4 border border-zinc-100 shadow-sm">
          <div className="p-4 bg-blue-50 rounded-2xl">
            <Clock className="h-8 w-8 text-[#0051b3]" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Próximo Turno</span>
            <div className="text-2xl font-bold text-zinc-900 uppercase">14:00 PM</div>
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Tabs de Categorías */}
        <div className="flex gap-2 p-1 bg-zinc-100/50 rounded-2xl w-fit">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                categoryFilter === cat
                  ? "bg-white text-[#0051b3] shadow-sm"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Buscador y Filtro de Estado */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="Buscar área..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-11 rounded-xl border-zinc-200 text-xs font-medium w-full"
            />
          </div>
          
          <Select value={activeFilter} onValueChange={(val: any) => setActiveFilter(val)}>
            <SelectTrigger className="h-11 text-xs font-bold rounded-xl border-zinc-200 bg-white w-[140px]">
              <span className="text-zinc-500 mr-1">Filtro:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-zinc-100 shadow-xl">
              <SelectItem value="ALL">Todas</SelectItem>
              <SelectItem value="ACTIVE">Activas</SelectItem>
              <SelectItem value="INACTIVE">Inactivas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de Áreas Comunes */}
      <div className="space-y-3">
        {isLoading ? (
          [1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full rounded-3xl" />)
        ) : filteredAreas.length > 0 ? (
          filteredAreas.map((area) => {
            const config = getStatusConfig(area.estado);
            return (
              <div
                key={area.id}
                onClick={() => {
                  setSelectedArea(area);
                  setIsUpdateOpen(true);
                }}
                className={`relative bg-white transition-all p-4 rounded-[1.5rem] border flex items-center gap-6 group cursor-pointer ${
                  !area.is_active 
                    ? "opacity-60 grayscale hover:opacity-80 border-zinc-200" 
                    : "hover:bg-zinc-50 border-zinc-100 shadow-sm hover:shadow-md"
                }`}
              >
                {/* Square Image */}
                <div className="h-16 w-16 rounded-2xl overflow-hidden flex-shrink-0 bg-zinc-100 border border-zinc-50">
                  {area.imagen ? (
                    <img
                      src={area.imagen.startsWith("http") ? area.imagen : `http://127.0.0.1:8000${area.imagen}`}
                      alt={area.nombre}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-zinc-300" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1">
                  <h3 className="font-bold text-zinc-900 text-base uppercase tracking-tight">
                    {area.nombre}
                    {!area.is_active && (
                      <span className="ml-2 text-[10px] text-zinc-500 font-bold bg-zinc-100 px-2 py-0.5 rounded-md">
                        Oculta
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                      <span className="text-[11px] font-bold text-zinc-500">Hoy, 09:30 AM</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-zinc-400" />
                      <span className="text-[11px] font-bold text-zinc-500">Carlos Ruiz</span>
                    </div>
                  </div>
                </div>

                {/* Badge de Estado o Inactividad */}
                {!area.is_active ? (
                  <div className="px-4 py-1.5 rounded-lg bg-zinc-800 text-white flex items-center gap-2">
                    <PowerOff className="h-3 w-3" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Inactiva</span>
                  </div>
                ) : (
                  <div className={`px-4 py-1.5 rounded-lg ${config.color} flex items-center gap-2`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{config.label}</span>
                  </div>
                )}

                <div className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="h-5 w-5 text-zinc-300" />
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 text-zinc-300" />
            </div>
            <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest">No se encontraron resultados</p>
          </div>
        )}
      </div>

      {/* SECCIÓN DE RESERVAS DE AFORO */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight uppercase text-zinc-900">Reservas de Aforo</h3>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Gestión de accesos por huésped</p>
          </div>
          <Button 
            onClick={() => setIsCreateAforoOpen(true)} 
            className="h-11 bg-zinc-900 hover:bg-black text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-md transition-all px-6 cursor-pointer"
          >
            Nueva Reserva
          </Button>
        </div>

        <div className="bg-white border border-zinc-100 rounded-[1.5rem] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50 border-b border-zinc-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Huésped</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Área</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Ingreso Prog.</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Estado</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {isLoadingAforos ? (
                  <tr><td colSpan={5} className="p-8 text-center text-zinc-400 text-xs font-bold uppercase tracking-widest">Cargando...</td></tr>
                ) : aforos.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-zinc-400 text-xs font-bold uppercase tracking-widest">No hay reservas</td></tr>
                ) : (
                  aforos.map((aforo) => (
                    <tr key={aforo.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-zinc-900">{aforo.huesped_details.nombre_completo}</td>
                      <td className="px-6 py-4 text-zinc-600">{aforo.area_comun_nombre}</td>
                      <td className="px-6 py-4 text-zinc-500 text-xs">{new Date(aforo.fecha_ingreso_programada).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`
                          font-bold text-[10px] uppercase tracking-widest
                          ${aforo.estado === 'EN_CURSO' ? 'bg-amber-50 text-amber-600 border-amber-200' : ''}
                          ${aforo.estado === 'CONFIRMADA' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
                          ${aforo.estado === 'PENDIENTE' ? 'bg-zinc-100 text-zinc-600' : ''}
                          ${aforo.estado === 'COMPLETADA' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : ''}
                          ${aforo.estado === 'CANCELADA' ? 'bg-red-50 text-red-600 border-red-200' : ''}
                        `}>
                          {aforo.estado_display}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="font-bold text-[10px] uppercase tracking-widest text-zinc-500 hover:text-zinc-900 rounded-lg cursor-pointer"
                          onClick={() => { setSelectedAforo(aforo); setIsManageAforoOpen(true); }}
                        >
                          Gestionar
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* COMPONENTES DIALOG (Al final del archivo, junto a los otros dialogs) */}
      <CreateAforoDialog open={isCreateAforoOpen} onOpenChange={setIsCreateAforoOpen} />
      <ManageAforoDialog open={isManageAforoOpen} onOpenChange={setIsManageAforoOpen} aforo={selectedAforo} />

      {/* Floating Action Button (Optional for Add) */}
      <button
        onClick={() => setIsCreateOpen(true)}
        className="fixed bottom-8 right-8 h-16 w-16 bg-[#0051b3] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer z-50"
      >
        <Plus className="h-8 w-8" />
      </button>

      {/* Dialogs */}
      <CreateCommonAreaDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      <UpdateCommonAreaDialog
        key={selectedArea?.id || "none"}
        open={isUpdateOpen}
        onOpenChange={setIsUpdateOpen}
        area={selectedArea}
        onDelete={handleDelete}
      />
    </div>
  );
}
