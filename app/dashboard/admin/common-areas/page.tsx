"use client";

import { useState, useMemo } from "react";
import { 
  Building2, 
  Clock, 
  Calendar, 
  User, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  Plus, 
  SlidersHorizontal,
  Dumbbell,
  Compass,
  Flame,
  Waves,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface CommonArea {
  id: string;
  name: string;
  category: "Interiores" | "Exteriores";
  status: "EN PROCESO" | "PROGRAMADO" | "COMPLETADO";
  time: string;
  staffName: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  description: string;
}

const initialAreas: CommonArea[] = [
  {
    id: "1",
    name: "Piscina Principal",
    category: "Exteriores",
    status: "EN PROCESO",
    time: "Hoy, 08:30 AM",
    staffName: "Carlos Ruiz",
    icon: Waves,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    description: "Tratamiento de cloro y limpieza de filtros."
  },
  {
    id: "2",
    name: "Gimnasio Nivel 2",
    category: "Interiores",
    status: "PROGRAMADO",
    time: "Mañana, 07:00 AM",
    staffName: "Elena Castro",
    icon: Dumbbell,
    iconBg: "bg-[#e2fbe8]",
    iconColor: "text-[#00723a]",
    description: "Desinfección de equipos y reposición de toallas."
  },
  {
    id: "3",
    name: "Jardines Zen",
    category: "Exteriores",
    status: "PROGRAMADO",
    time: "24 Oct, 10:00 AM",
    staffName: "Roberto Gómez",
    icon: Compass,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    description: "Poda artística y mantenimiento del estanque koi."
  },
  {
    id: "4",
    name: "Área de Barbacoa",
    category: "Exteriores",
    status: "EN PROCESO",
    time: "Hoy, 18:30 PM",
    staffName: "Luis Méndez",
    icon: Flame,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    description: "Limpieza profunda de parrillas y reposición de carbón."
  }
];

export default function CommonAreasPage() {
  const [areas, setAreas] = useState<CommonArea[]>(initialAreas);
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | "Interiores" | "Exteriores">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrado de áreas comunes
  const filteredAreas = useMemo(() => {
    return areas.filter((area) => {
      const matchesCategory = categoryFilter === "ALL" || area.category === categoryFilter;
      const matchesSearch = 
        area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        area.staffName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [areas, categoryFilter, searchQuery]);

  const handleAction = (areaName: string, action: string) => {
    toast(`Mantenimiento de ${areaName}`, {
      description: `Operación: ${action} asignada al supervisor de turno.`
    });
  };

  const handleCreateArea = () => {
    toast.success("Nueva Área Registrada", {
      description: "Inicializando protocolo de mantenimiento preventivo para nueva locación."
    });
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      
      {/* Cabecera y botón principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-extrabold tracking-tight text-dark-primary">
            Mantenimiento de Áreas
          </h2>
          <p className="text-dark-secondary text-sm max-w-2xl leading-relaxed">
            Optimización constante para su bienestar residencial. Controle las rondas de limpieza y el estado operativo.
          </p>
        </div>

        <Button 
          onClick={handleCreateArea}
          className="bg-brand-blue hover:bg-blue-600 text-white font-semibold rounded-xl text-xs flex items-center gap-2 py-3.5 px-5 shadow-lg shadow-brand-blue/15 transition-all cursor-pointer self-start md:self-center"
        >
          <Plus className="h-4.5 w-4.5" />
          Registrar Área
        </Button>
      </div>

      {/* Grid de Banner del Estado Global y Próximo Turno */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Banner 1 (Estado Global - Spans 2 cols) */}
        <div className="bg-brand-blue rounded-2xl p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden lg:col-span-2 min-h-[150px] shadow-lg shadow-brand-blue/15">
          {/* Fondo decorativo */}
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
            <svg width="300" height="150" viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="250" cy="50" r="100" stroke="white" strokeWidth="8" />
            </svg>
          </div>

          <div className="flex flex-col gap-2 relative z-10">
            <span className="text-[10px] font-extrabold tracking-widest uppercase text-white/70">
              ESTADO GLOBAL
            </span>
            <h3 className="text-2xl font-extrabold tracking-tight">
              Mantenimiento de Áreas
            </h3>
            <p className="text-xs text-white/85 leading-relaxed font-medium max-w-sm">
              Optimización constante para su bienestar residencial. Todas las zonas críticas se encuentran bajo supervisión.
            </p>
          </div>

          <div className="text-right shrink-0 relative z-10 self-end sm:self-center">
            <span className="text-5xl font-black tracking-tight">
              84%
            </span>
          </div>
        </div>

        {/* Banner 2 (Próximo Turno) */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between items-center text-center min-h-[150px]">
          <div className="bg-blue-50 text-brand-blue p-2.5 rounded-xl">
            <Clock className="h-5 w-5" />
          </div>
          
          <div className="flex flex-col gap-1 mt-2">
            <span className="text-[10px] font-extrabold text-dark-secondary/80 tracking-widest uppercase">
              PRÓXIMO TURNO
            </span>
            <span className="text-2xl font-black text-dark-primary tracking-tight">
              14:00 PM
            </span>
          </div>

          <span className="text-[10px] text-dark-secondary font-semibold">
            Ronda de supervisión general
          </span>
        </div>

      </div>

      {/* Píldoras de Categoría & Barra de Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Filtro de Categoría */}
        <div className="flex bg-zinc-100 p-1 rounded-xl w-fit">
          {([
            { label: "Todos", value: "ALL" },
            { label: "Interiores", value: "Interiores" },
            { label: "Exteriores", value: "Exteriores" }
          ] as const).map((cat) => {
            const isActive = categoryFilter === cat.value;
            return (
              <button
                key={cat.label}
                onClick={() => setCategoryFilter(cat.value)}
                className={`text-xs font-extrabold px-5 py-2.5 rounded-lg transition-all cursor-pointer ${
                  isActive 
                    ? "bg-white text-brand-blue shadow-xs" 
                    : "text-dark-secondary hover:text-dark-primary"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Buscador */}
        <div className="relative w-full sm:w-72">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-dark-secondary/60" />
          <Input
            type="text"
            placeholder="Buscar área o supervisor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 bg-white border-zinc-200 rounded-xl text-xs h-10 shadow-2xs focus:border-brand-blue/30"
          />
        </div>

      </div>

      {/* Listado de Tarjetas de Áreas Comunes */}
      <div className="flex flex-col gap-4">
        {filteredAreas.length > 0 ? (
          filteredAreas.map((area) => {
            const IconComponent = area.icon;
            return (
              <div
                key={area.id}
                className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all duration-250 flex flex-col sm:flex-row sm:items-center justify-between gap-5 group"
              >
                {/* Lado Izquierdo: Icono/Thumbnail & Información */}
                <div className="flex items-center gap-5">
                  <div className={`h-14 w-14 rounded-xl ${area.iconBg} ${area.iconColor} flex items-center justify-center shrink-0 border border-zinc-100 group-hover:scale-105 transition-transform duration-200`}>
                    <IconComponent className="h-6 w-6 stroke-[1.8]" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-sm font-black text-dark-primary group-hover:text-brand-blue transition-colors">
                        {area.name}
                      </h4>
                      <span className="text-[10px] font-extrabold text-dark-secondary/60 bg-zinc-100 px-2 py-0.5 rounded-md">
                        {area.category}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] text-dark-secondary font-bold">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-dark-secondary/70" />
                        {area.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-dark-secondary/70" />
                        {area.staffName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Lado Derecho: Badge de Estado & Botones de Acciones */}
                <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-50">
                  
                  {/* Badge de Estado */}
                  <span className={`text-[10px] font-black px-3.5 py-1.5 rounded-full ${
                    area.status === "EN PROCESO" 
                      ? "bg-blue-50 text-brand-blue border border-blue-100" 
                      : area.status === "PROGRAMADO"
                      ? "bg-zinc-100 text-zinc-500"
                      : "bg-[#e2fbe8] text-[#00723a]"
                  }`}>
                    {area.status}
                  </span>

                  {/* Acciones de Tarjeta */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAction(area.name, "Ver checklist completo")}
                      className="text-xs font-bold text-dark-secondary hover:text-dark-primary hover:bg-zinc-100 px-3 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      Checklist
                    </button>
                    
                    <button
                      onClick={() => handleAction(area.name, "Finalizar turno de mantenimiento")}
                      className="text-xs font-bold text-brand-blue hover:text-blue-700 bg-brand-blue/5 hover:bg-brand-blue/10 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                    >
                      Completar
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })
        ) : (
          <div className="bg-white border border-zinc-100 rounded-2xl py-12 text-center text-xs font-semibold text-dark-secondary">
            No se encontraron áreas comunes que coincidan con su filtro.
          </div>
        )}
      </div>

    </div>
  );
}
