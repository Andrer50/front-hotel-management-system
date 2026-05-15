"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  Shield,
  Layers,
  ConciergeBell,
  Briefcase,
  BarChart3,
  Sparkles,
  HelpCircle,
  LogOut,
  Hotel,
  CalendarDays,
  Users,
  BedDouble,
  Building2,
  Package,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    name: "Administración",
    href: "/dashboard/admin/administration",
    icon: Shield,
  },
  { name: "Personal", href: "/dashboard/admin/users", icon: Layers },
  {
    name: "Clientes",
    href: "/dashboard/admin/clients",
    icon: Users,
  },
  {
    name: "Reservas",
    href: "/dashboard/admin/reservations",
    icon: CalendarDays,
  },
  {
    name: "Habitaciones",
    href: "/dashboard/admin/rooms",
    icon: BedDouble,
  },
  {
    name: "Áreas Comunes",
    href: "/dashboard/admin/common-areas",
    icon: Building2,
  },
  {
    name: "Inventario",
    href: "/dashboard/admin/inventory",
    icon: Package,
  },
  {
    name: "Roles",
    href: "/dashboard/admin/roles",
    icon: Shield,
  },
  { name: "Comercial", href: "/dashboard/admin/commercial", icon: Briefcase },
  {
    name: "Estadísticas",
    href: "/dashboard/admin/statistics",
    icon: BarChart3,
  },
  { name: "IA", href: "/dashboard/admin/ai", icon: Sparkles },
];

export function AdminSidebar() {
  const pathname = usePathname();

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
          {navigationItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
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
              className="group flex items-center gap-3 px-4 py-5 rounded-xl text-[13px] font-semibold text-dark-secondary hover:text-dark-primary hover:bg-zinc-50 transition-all duration-200 h-10 cursor-pointer"
            >
              <Link href="/dashboard/admin/help">
                <HelpCircle className="h-4.5 w-4.5 text-dark-secondary/70 group-hover:text-dark-primary" />
                <span>Ayuda</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

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
