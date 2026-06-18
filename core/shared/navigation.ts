import {
  Home,
  Layers,
  Users,
  CalendarDays,
  Calendar, // ← Icono limpio para tus Temporadas
  BedDouble,
  AlertTriangle,
  Building2,
  Package,
  BarChart3,
  Shield,
  Brush,
  Receipt,
  LucideIcon,
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
}

export const navigationItems: NavItem[] = [
  {
    name: "Home",
    href: "/dashboard/admin",
    icon: Home,
  },
  {
    name: "Personal",
    href: "/dashboard/admin/users",
    icon: Layers,
    permission: "can_manage_users",
  },
  {
    name: "Clientes",
    href: "/dashboard/admin/clients",
    icon: Users,
    permission: "can_manage_users",
  },
  {
    name: "Reservas",
    href: "/dashboard/admin/reservations",
    icon: CalendarDays,
    permission: "can_manage_reservations",
  },
  {
    name: "Pagos",
    href: "/dashboard/admin/payments",
    icon: Receipt,
    permission: "can_manage_reservations",
  },
  {
    name: "Habitaciones",
    href: "/dashboard/admin/rooms",
    icon: BedDouble,
    permission: "can_manage_rooms",
  },
  {
    name: "Temporadas",
    href: "/dashboard/admin/temporadas",
    icon: Calendar, // Tu nuevo botón tuning
    permission: "can_manage_rooms", // Protegido con el rol de administración de cuartos
  },
  {
    name: "Estados de Limpieza",
    href: "/dashboard/admin/limpieza",
    icon: Brush,
    permission: "can_clean_rooms",
  },
  {
    name: "Incidencias",
    href: "/dashboard/admin/incidencias",
    icon: AlertTriangle,
    permission: "can_do_maintenance",
  },
  {
    name: "Áreas Comunes",
    href: "/dashboard/admin/common-areas",
    icon: Building2,
    permission: "can_manage_rooms",
  },
  {
    name: "Inventario",
    href: "/dashboard/admin/inventory",
    icon: Package,
    permission: "can_manage_inventory",
  },
  {
    name: "Roles",
    href: "/dashboard/admin/roles",
    icon: Shield,
    permission: "can_manage_roles",
  },
  {
    name: "Estadísticas",
    href: "/dashboard/admin/statistics",
    icon: BarChart3,
    permission: "can_view_reports",
  },
];