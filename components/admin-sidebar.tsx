"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSessionContext } from "@/context/session-context";
import { cn } from "@/lib/utils";
import { Hotel, HelpCircle, LogOut } from "lucide-react";
import { navigationItems } from "@/core/shared/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function AdminSidebar() {
  const pathname = usePathname();
  const { session } = useSessionContext();

  const userPermissions = session?.user?.permissions || [];
  const userRole = session?.user?.role;

  const filteredItems = navigationItems.filter((item) => {
    // Si no tiene permiso requerido, se muestra a todos
    if (!item.permission) return true;

    // Verificar si el usuario tiene el permiso específico
    return userPermissions.includes(item.permission);
  });

  return (
    <Sidebar className="border-r border-zinc-100 bg-white">
      {/* Cabecera / Logotipo de la marca */}
      <SidebarHeader className="p-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="bg-brand-blue text-white p-2 rounded-xl shadow-md shadow-brand-blue/15">
            <Hotel className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-[15px] tracking-tight text-dark-primary leading-tight">
              ASTURIAS SUITES
            </h1>
            <p className="text-[10px] font-bold text-brand-blue/70 tracking-widest uppercase mt-0.5">
              Sistema de Gestión
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Contenido / Enlaces de navegación */}
      <SidebarContent className="px-4 py-4 flex flex-col gap-1.5">
        <SidebarMenu className="flex flex-col gap-1.5">
          {filteredItems.map((item) => {
            const isActive =
              item.href === "/dashboard/admin"
                ? pathname === "/dashboard/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={cn(
                    "group flex items-center justify-between px-4 py-6 rounded-xl text-[13px] font-semibold transition-all duration-200 relative h-11 border border-transparent cursor-pointer",
                    isActive
                      ? "bg-brand-blue/5 text-brand-blue hover:bg-brand-blue/5 hover:text-brand-blue"
                      : "text-dark-secondary hover:text-dark-primary hover:bg-zinc-50",
                  )}
                >
                  <Link href={item.href}>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "h-4.5 w-4.5 transition-colors",
                          isActive
                            ? "text-brand-blue"
                            : "text-dark-secondary/70 group-hover:text-dark-primary",
                        )}
                      />
                      <span>{item.name}</span>
                    </div>

                    {/* Indicador de barra vertical activa */}
                    {isActive && (
                      <div className="absolute right-0 top-3 bottom-3 w-1 bg-brand-blue rounded-l-full" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Pie / Opciones adicionales y desconexión */}
      <SidebarFooter className="p-4 border-t border-zinc-100 flex flex-col gap-1">
        <SidebarMenu className="flex flex-col gap-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="group flex items-center gap-3 px-4 py-5 rounded-xl text-[13px] font-semibold text-red-600 hover:text-red-700 hover:bg-red-50/50 transition-all duration-200 h-10 cursor-pointer"
            >
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-3 text-left"
              >
                <LogOut className="h-4.5 w-4.5 text-red-500 group-hover:text-red-600" />
                <span>Cerrar sesión</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
