"use client";

import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { 
  Plus, 
  Sparkles, 
  SlidersHorizontal, 
  Filter, 
  MoreVertical, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2,
  CalendarDays,
  UserCheck2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CreateUserDialog } from "@/presentation/dashboard/admin/users/create-user-dialog";
import { useGetUsersQuery } from "@/modules/user/domain/hooks/useUserQueries";
import { User } from "@/core/user/interfaces";

// Interfaces de datos para el Directorio de Personal
interface PersonalMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: "Servicios al cliente" | "Operaciones" | "Servicios" | "Comercial" | "Recepción";
  status: "Activo" | "En Vacaciones";
  avatarBg: string;
  initials: string;
}

export default function UsersManagementPage() {
  const { data: session } = useSession();
  const [activeDepartmentFilter, setActiveDepartmentFilter] = useState<string>("Todos los Departamentos");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: users = [], isLoading } = useGetUsersQuery();

  // Mapeo de usuarios del backend al formato de la UI
  const staff = useMemo(() => {
    return users.map((u) => ({
      id: u.id.toString(),
      name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.username,
      email: u.email,
      role: u.role_details?.name || "Sin Rol",
      department: (u.role_details?.name || "Recepción") as any, 
      status: "Activo" as const,
      avatarBg: "bg-blue-100 text-blue-600",
      initials: (u.firstName?.[0] || u.username?.[0] || "U").toUpperCase() + (u.lastName?.[0] || "").toUpperCase()
    }));
  }, [users]);

  // Filtro inteligente de personal por departamento y búsqueda
  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      // Filtro de Departamento
      const matchesDept = 
        activeDepartmentFilter === "Todos los Departamentos" ||
        (activeDepartmentFilter === "Recepción" && member.department === "Recepción") ||
        (activeDepartmentFilter === "Conserjería" && member.department === "Servicios al cliente") ||
        (activeDepartmentFilter === "Operaciones" && member.department === "Operaciones");

      // Filtro de Búsqueda de Texto
      const matchesSearch = 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesDept && matchesSearch;
    });
  }, [staff, activeDepartmentFilter, searchQuery]);

  // Cálculos de KPIs dinámicos
  const stats = useMemo(() => {
    const total = filteredStaff.length;
    const activos = filteredStaff.filter((m) => m.status === "Activo").length;
    const vacaciones = filteredStaff.filter((m) => m.status === "En Vacaciones").length;
    return { total, activos, vacaciones };
  }, [filteredStaff]);

  const handleAddStaff = () => {
    setIsCreateOpen(true);
  };

  const handleActionMenu = (name: string) => {
    toast(`Opciones para ${name}`, {
      description: "Editar contrato, reasignar departamento o cambiar privilegios de acceso."
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 animate-fade-in pb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-pulse">
          <div className="flex flex-col gap-3">
            <div className="h-8 bg-zinc-200 rounded-xl w-48"></div>
            <div className="h-4 bg-zinc-100 rounded-lg w-full max-w-lg mt-1"></div>
          </div>
          <div className="h-12 bg-blue-100 rounded-xl w-48"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[400px]">
          <div className="lg:col-span-8 bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs animate-pulse"></div>
          <div className="lg:col-span-4 bg-[#002f6c] rounded-2xl p-6 shadow-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      
      {/* Sección Superior: Título de Sección y Botón de Acción Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-3xl font-extrabold tracking-tight text-dark-primary">
            Mantenimiento de Personal
          </h2>
          <p className="text-dark-secondary text-sm max-w-2xl leading-relaxed">
            Gestione su equipo de hospitalidad, defina privilegios de acceso y supervise el estado operativo en todos los departamentos de lujo.
          </p>
        </div>

        {/* Botón de Añadir Personal con estilo idéntico al de la imagen */}
        <Button 
          onClick={handleAddStaff}
          className="bg-brand-blue hover:bg-blue-600 text-white font-semibold rounded-xl text-xs flex items-center gap-2 py-3.5 px-5 shadow-lg shadow-brand-blue/15 hover:shadow-brand-blue/25 transition-all duration-200 cursor-pointer w-fit self-start md:self-center"
        >
          <Plus className="h-4.5 w-4.5" />
          Añadir Nuevo Personal
        </Button>
      </div>

      {/* Grid de Tarjetas Operativas e IA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Tarjeta de Vista General Operativa */}
        <div className="col-span-1 lg:col-span-8 bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col gap-6 justify-between">
          
          {/* Header de la tarjeta con filtros */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="font-bold text-[15px] tracking-tight text-dark-primary">
              Vista General Operativa
            </h3>
            
            {/* Filtros horizontales en píldoras */}
            <div className="flex flex-wrap gap-1.5 bg-zinc-50 p-1 rounded-xl w-fit">
              {["Todos los Departamentos", "Recepción", "Conserjería"].map((dept) => {
                const isActive = activeDepartmentFilter === dept;
                return (
                  <button
                    key={dept}
                    onClick={() => {
                      setActiveDepartmentFilter(dept);
                      setCurrentPage(1);
                    }}
                    className={`text-[11px] font-bold px-3.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? "bg-[#ebfef2] text-[#00723a] shadow-xs" 
                        : "text-dark-secondary hover:text-dark-primary hover:bg-zinc-100/50"
                    }`}
                  >
                    {dept === "Todos los Departamentos" ? "Todos los Personal" : dept}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Estadísticas de la Tarjeta */}
          <div className="grid grid-cols-3 gap-6 pt-2">
            
            {/* Stat 1: Total */}
            <div className="flex flex-col gap-1 border-r border-zinc-100">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-brand-blue tracking-tight">
                  {stats.total}
                </span>
                <UserCheck2 className="h-4 w-4 text-brand-blue/40 hidden sm:block" />
              </div>
              <span className="text-[10px] font-extrabold text-dark-secondary tracking-widest uppercase">
                Personal Total
              </span>
            </div>

            {/* Stat 2: Activos */}
            <div className="flex flex-col gap-1 border-r border-zinc-100">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-[#00723a] tracking-tight">
                  {stats.activos}
                </span>
                <CheckCircle2 className="h-4 w-4 text-[#00723a]/40 hidden sm:block" />
              </div>
              <span className="text-[10px] font-extrabold text-dark-secondary tracking-widest uppercase">
                Activos Actualmente
              </span>
            </div>

            {/* Stat 3: En vacaciones */}
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-zinc-500 tracking-tight">
                  {stats.vacaciones}
                </span>
                <CalendarDays className="h-4 w-4 text-zinc-400/40 hidden sm:block" />
              </div>
              <span className="text-[10px] font-extrabold text-dark-secondary tracking-widest uppercase">
                En Vacaciones
              </span>
            </div>

          </div>

        </div>

        {/* Tarjeta de Optimización por IA con gradiente premium */}
        <div className="col-span-1 lg:col-span-4 bg-gradient-to-br from-brand-blue to-blue-700 text-white rounded-2xl p-6 shadow-lg shadow-brand-blue/15 flex flex-col justify-between gap-6 hover:shadow-brand-blue/25 transition-all duration-300 group">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-white font-bold text-xs tracking-wider uppercase">
              <Sparkles className="h-4.5 w-4.5 text-blue-200 animate-pulse" />
              Optimización de Recursos por IA
            </div>
            <p className="text-blue-100 text-[13px] leading-relaxed font-light mt-1.5">
              Nuestra inteligencia de conserjería ahora predice picos de demanda de personal para los fines de semana de alta ocupación.
            </p>
          </div>

          <button 
            onClick={() => toast.info("Generando informe predictivo...")}
            className="text-[10px] font-extrabold tracking-widest uppercase mt-4 text-white hover:text-blue-200 flex items-center gap-1 hover:translate-x-1.5 transition-transform duration-200 cursor-pointer self-start"
          >
            Ver Perspectivas <span className="font-sans">&gt;</span>
          </button>
        </div>

      </div>

      {/* Sección del Directorio / Listado de Personal */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
        
        {/* Cabecera del Listado con Filtros Rápidos */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 min-w-0">
          <div className="flex items-center gap-3 shrink-0">
            <h3 className="font-bold text-[15px] tracking-tight text-dark-primary whitespace-nowrap">
              Directorio de Personal
            </h3>
            <span className="text-[#00723a] bg-[#ebfef2] text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs select-none">
              92.8%
            </span>
          </div>

          {/* Acciones del Listado */}
          <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto min-w-0">
            
            {/* Buscador de personal en tabla */}
            <div className="relative flex-1 lg:flex-none min-w-0">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-dark-secondary/60" />
              <Input
                type="text"
                placeholder="Buscar personal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-[#f8fafc] border-transparent hover:bg-zinc-100/50 text-xs rounded-xl w-full min-w-0 lg:w-56 h-9 focus:bg-white focus:border-brand-blue/30 transition-all"
              />
            </div>

            {/* Botón de Filtros Rápidos */}
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl border-zinc-200 hover:bg-zinc-50 text-dark-secondary hover:text-dark-primary cursor-pointer shrink-0"
              onClick={() => toast("Filtros avanzados abiertos")}
            >
              <Filter className="h-4 w-4" />
            </Button>

            {/* Botón de Orden */}
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl border-zinc-200 hover:bg-zinc-50 text-dark-secondary hover:text-dark-primary cursor-pointer shrink-0"
              onClick={() => toast("Criterios de orden abiertos")}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabla Responsiva del Personal */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-zinc-100 text-[10px] font-bold text-dark-secondary/80 tracking-widest uppercase">
                <th className="pb-4 font-bold text-left">Miembro del Equipo</th>
                <th className="pb-4 font-bold text-left">Rol y Departamento</th>
                <th className="pb-4 font-bold text-left">Estado</th>
                <th className="pb-4 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length > 0 ? (
                filteredStaff.map((member) => (
                  <tr 
                    key={member.id} 
                    className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors last:border-0"
                  >
                    {/* Celda: Perfil */}
                    <td className="py-4.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-full ${member.avatarBg} flex items-center justify-center font-bold text-xs shadow-xs`}>
                          {member.initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-dark-primary">
                            {member.name}
                          </span>
                          <span className="text-[10px] text-dark-secondary font-medium">
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Celda: Rol & Departamento */}
                    <td className="py-4.5 pr-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-dark-primary">
                          {member.role}
                        </span>
                        <span className="text-[10px] text-dark-secondary font-semibold uppercase tracking-wider mt-0.5">
                          {member.department}
                        </span>
                      </div>
                    </td>

                    {/* Celda: Estado */}
                    <td className="py-4.5 pr-4">
                      {member.status === "Activo" ? (
                        <span className="inline-flex items-center gap-1.5 bg-[#ebfef2] text-[#00723a] text-[10px] font-extrabold px-3 py-1 rounded-full shadow-xs border border-emerald-100/10">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-zinc-100 text-zinc-600 text-[10px] font-extrabold px-3 py-1 rounded-full shadow-xs">
                          <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                          En Vacaciones
                        </span>
                      )}
                    </td>

                    {/* Celda: Acciones de Fila */}
                    <td className="py-4.5 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleActionMenu(member.name)}
                        className="h-8 w-8 rounded-lg text-dark-secondary/60 hover:text-dark-primary hover:bg-zinc-100 cursor-pointer"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-xs font-medium text-dark-secondary">
                    No se encontraron miembros del personal para el criterio especificado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación de Tabla */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-zinc-100/60 text-xs text-dark-secondary select-none">
          <span>
            Mostrando 1-{filteredStaff.length} de {filteredStaff.length} en total
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
              onClick={() => toast("Cargando página 2...")}
            >
              2
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-lg hover:bg-zinc-100 text-dark-secondary hover:text-dark-primary font-bold text-xs"
              onClick={() => toast("Cargando página 3...")}
            >
              3
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 rounded-lg border-zinc-200 text-dark-secondary hover:text-dark-primary cursor-pointer text-xs flex items-center gap-1 font-semibold"
              onClick={() => toast("Cargando página siguiente...")}
            >
              Siguiente
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

      </div>

      <CreateUserDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

    </div>
  );
}
