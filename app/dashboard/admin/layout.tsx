"use client";

import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardNavbar } from "@/presentation/dashboard/navbar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex flex-row min-h-screen bg-[#f8fafc] font-sans antialiased w-full">
        
        {/* Sidebar de administración de Shadcn */}
        <AdminSidebar />

        {/* Panel de Contenido Principal de Shadcn */}
        <SidebarInset className="flex-1 flex flex-col min-h-screen overflow-x-hidden bg-[#f8fafc] border-0">
          
          {/* Barra de Navegación Superior Refactorizada */}
          <DashboardNavbar />

          {/* Área de Visualización de la Página */}
          <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            {children}
          </main>

        </SidebarInset>

      </div>
    </SidebarProvider>
  );
}
