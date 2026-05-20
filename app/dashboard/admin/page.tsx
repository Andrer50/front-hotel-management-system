"use client";

import Link from "next/link";
import { useSessionContext } from "@/context/session-context";
import { navigationItems } from "@/core/shared/navigation";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Hotel, ArrowRight } from "lucide-react";

export default function AdminHomePage() {
  const { session } = useSessionContext();
  
  const userRole = session?.user?.role || "Usuario";
  const userPermissions = session?.user?.permissions || [];
  const userName = session?.user?.name || "Bienvenido";

  const filteredItems = navigationItems.filter((item) => {
    if (!item.permission) return true;
    return userPermissions.includes(item.permission);
  });

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header de Bienvenida */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-dark-primary tracking-tight">
          Hola, {userName} 👋
        </h1>
        <p className="text-dark-secondary font-medium">
          Tienes el rol de <span className="text-brand-blue font-bold uppercase">{userRole}</span>. 
          Aquí tienes acceso a los siguientes módulos de gestión:
        </p>
      </div>

      {/* Grid de Accesos Directos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href}>
              <Card className="group hover:border-brand-blue/50 hover:shadow-lg hover:shadow-brand-blue/10 transition-all duration-300 cursor-pointer h-full border-zinc-100 overflow-hidden relative">
                {/* Decoración de fondo al hacer hover */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-blue/5 rounded-full group-hover:scale-150 transition-transform duration-500" />
                
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="p-3 rounded-2xl bg-zinc-50 text-dark-secondary group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300 shadow-sm border border-zinc-100/50">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg font-bold text-dark-primary group-hover:text-brand-blue transition-colors">
                    {item.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="text-dark-secondary/80 font-medium mb-4">
                    Gestionar el apartado de {item.name.toLowerCase()} del sistema.
                  </CardDescription>
                  
                  <div className="flex items-center text-[13px] font-bold text-brand-blue opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                    <span>Acceder ahora</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Card de Resumen / Estado */}
      <Card className="bg-brand-blue border-none shadow-xl shadow-brand-blue/20 overflow-hidden relative">
        <div className="absolute right-0 top-0 opacity-10 p-4">
          <Hotel className="h-32 w-32 text-white" />
        </div>
        <CardHeader>
          <CardTitle className="text-white text-xl">Estado del Sistema</CardTitle>
          <CardDescription className="text-white/80 font-medium">
            Sincronizado con el servidor central de Asturias Suites.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white font-bold text-sm">Conexión Segura Activa</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
