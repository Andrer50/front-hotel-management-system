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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useGetCommonAreasQuery,
} from "@/modules/common-area/domain/hooks/useCommonAreaQueries";
import { useDeleteCommonAreaMutation } from "@/modules/common-area/domain/hooks/useCommonAreaMutations";
import { CommonArea, CommonAreaEstado } from "@/core/common-area/interfaces";
import { CreateCommonAreaDialog } from "@/presentation/dashboard/admin/common-areas/create-common-area-dialog";
import { UpdateCommonAreaDialog } from "@/presentation/dashboard/admin/common-areas/update-common-area-dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function CommonAreasPage() {
  const { data: areas = [], isLoading } = useGetCommonAreasQuery();
  const { mutate: deleteArea } = useDeleteCommonAreaMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<CommonArea | null>(null);

  const categories = ["Todos", "Interiores", "Exteriores"];

  const filteredAreas = areas.filter((area) => {
    const matchesSearch = area.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "Todos" || area.categoria === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStatusConfig = (status: CommonAreaEstado) => {
    switch (status) {
      case "DISPONIBLE":
        return {
          color: "bg-emerald-50 text-emerald-600",
          label: "OPERATIVO",
          dot: "bg-emerald-500",
        };
      case "MANTENIMIENTO":
        return {
          color: "bg-blue-50 text-blue-600",
          label: "EN PROCESO",
          dot: "bg-blue-500",
        };
      case "RESTRINGIDO":
        return {
          color: "bg-zinc-100 text-zinc-500",
          label: "PROGRAMADO",
          dot: "bg-zinc-400",
        };
      default:
        return {
          color: "bg-zinc-50 text-zinc-400",
          label: "DESCONOCIDO",
          dot: "bg-zinc-300",
        };
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
      {/* Header Cards (As per Image) */}
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

      {/* Tabs Filter (As per Image) */}
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

      {/* Areas List (As per Image) */}
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
                className="bg-white hover:bg-zinc-50 transition-all p-4 rounded-[1.5rem] border border-zinc-100 flex items-center gap-6 group cursor-pointer shadow-sm hover:shadow-md"
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
                  <h3 className="font-bold text-zinc-900 text-base uppercase tracking-tight">{area.nombre}</h3>
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

                {/* Badge */}
                <div className={`px-4 py-1.5 rounded-lg ${config.color} flex items-center gap-2`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{config.label}</span>
                </div>

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
