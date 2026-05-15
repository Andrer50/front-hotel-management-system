"use client";

import { useSessionContext } from "@/context/session-context";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search, Bell, Settings, User } from "lucide-react";

export const DashboardNavbar = () => {
  const { session } = useSessionContext();

  return (
    <header className="h-16 border-b border-zinc-100 bg-white px-4 md:px-8 flex items-center justify-between sticky top-0 z-20 gap-4">
      {/* Lado Izquierdo: Trigger del Sidebar + Buscador */}
      <div className="flex items-center gap-3 flex-1 max-w-xs md:max-w-md">
        <SidebarTrigger className="text-dark-secondary hover:text-dark-primary h-9 w-9 rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer shrink-0" />

        {/* Buscador Superior (Oculto en móvil pequeño para evitar congestión) */}
        <div className="relative group flex-1 hidden sm:block">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-dark-secondary/60 group-focus-within:text-brand-blue transition-colors">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Buscar en el panel..."
            className="bg-[#f1f5f9] border border-transparent focus:border-brand-blue/20 focus:bg-white focus:ring-4 focus:ring-brand-blue/5 rounded-xl pl-10 pr-4 py-2 text-xs text-dark-primary placeholder-zinc-400 w-full transition-all duration-200 outline-none"
          />
        </div>
      </div>

      {/* Acciones del Usuario & Perfil */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* Notificaciones & Ajustes */}
        <div className="flex items-center gap-1 md:gap-3 text-dark-secondary">
          <button className="p-2 hover:bg-zinc-50 rounded-xl transition-all duration-200 text-dark-secondary/80 hover:text-dark-primary relative cursor-pointer">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>
          <button className="p-2 hover:bg-zinc-50 rounded-xl transition-all duration-200 text-dark-secondary/80 hover:text-dark-primary cursor-pointer">
            <Settings className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Separador vertical */}
        <div className="h-6 w-px bg-zinc-100" />

        {/* Información del Perfil */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-dark-primary group-hover:text-brand-blue transition-colors leading-tight">
              {session?.user?.name || "Usuario"}
            </p>
            <p className="text-[10px] font-semibold text-dark-secondary/70 leading-tight mt-0.5 capitalize">
              {session?.user?.role || "Colaborador"}
            </p>
          </div>

          {/* Avatar del usuario */}
          <div className="relative h-9 w-9 rounded-xl bg-brand-blue/10 border border-brand-blue/20 overflow-hidden flex items-center justify-center text-brand-blue group-hover:scale-105 transition-transform duration-200">
            <User className="h-4.5 w-4.5" />
          </div>
        </div>
      </div>
    </header>
  );
};
