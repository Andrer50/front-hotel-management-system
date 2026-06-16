"use client";

import { useState } from "react";
import { Shield, ShieldAlert, CheckCircle2, Lock, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Permiso {
  id: string;
  llave: string;
  nombre: string;
  descripcion: string;
}

interface RolConPermisos {
  id: string;
  nombre: string;
  descripcion: string;
  permisos: string[];
}

const PERMISOS_SISTEMA: Permiso[] = [
  { id: "p1", llave: "can_manage_users", nombre: "Gestión de Usuarios", descripcion: "Registrar, editar y administrar el estado operativo del personal." },
  { id: "p2", llave: "can_manage_roles", nombre: "Gestión de Roles", descripcion: "Modificar matrices de seguridad, restricciones y niveles de acceso." },
  { id: "p3", llave: "can_manage_reservations", nombre: "Gestión de Reservas", descripcion: "Control total de operaciones del Front-Desk (Check-in, Check-out)." },
  { id: "p4", llave: "can_manage_rooms", nombre: "Mantenimiento de Habitaciones", descripcion: "Actualizar habitabilidad, estados de limpieza y áreas comunes." },
  { id: "p5", llave: "can_manage_inventory", nombre: "Control de Inventario", descripcion: "Administrar insumos de hospitalidad, suministros y existencias." },
  { id: "p6", llave: "can_view_reports", nombre: "Visualización de Reportes", descripcion: "Acceso a analítica predictiva de demanda y estadísticas financieras." },
];

const ROLES_INICIALES: RolConPermisos[] = [
  { id: "1", nombre: "Administrador", descripcion: "Acceso total e irrestricto a todos los módulos y configuraciones globales.", permisos: PERMISOS_SISTEMA.map(p => p.llave) },
  { id: "2", nombre: "Recepcionista", descripcion: "Gestión operativa de huéspedes, flujos de reserva y asignación de habitaciones.", permisos: ["can_manage_reservations"] },
  { id: "3", nombre: "Personal de Limpieza", descripcion: "Control y reporte del estado de habitabilidad de las suites del hotel.", permisos: ["can_manage_rooms"] },
];

export function RolesManagement() {
  const [roles, setRoles] = useState<RolConPermisos[]>(ROLES_INICIALES);
  const [rolSeleccionadoId, setRolSeleccionadoId] = useState<string>("2");
  const [isPending, setIsPending] = useState(false);

  const rolActual = roles.find(r => r.id === rolSeleccionadoId) || roles[0];

  const handleTogglePermiso = (llavePermiso: string) => {
    if (rolActual.nombre.toLowerCase() === "administrador" || rolActual.nombre.toLowerCase() === "admin") {
      toast.error("Seguridad del Sistema", {
        description: "El rol Administrador debe conservar todos los accesos nativos de seguridad."
      });
      return;
    }

    const nuevosPermisos = rolActual.permisos.includes(llavePermiso)
      ? rolActual.permisos.filter(p => p !== llavePermiso)
      : [...rolActual.permisos, llavePermiso];

    setRoles(roles.map(r => r.id === rolActual.id ? { ...r, permisos: nuevosPermisos } : r));
  };

  const handleGuardarMatriz = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    setTimeout(() => {
      setIsPending(false);
      toast.success("Matriz de Permisos Actualizada", {
        description: `Las llaves de acceso para [${rolActual.nombre.toUpperCase()}] fueron sincronizadas con el proxy.`
      });
    }, 600);
  };

  return (
    <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-[15px] tracking-tight text-dark-primary flex items-center gap-2">
            <Shield className="h-4.5 w-4.5 text-brand-blue" />
            RF02 - Matriz de Seguridad y Privilegios
          </h3>
          <p className="text-dark-secondary text-xs">
            Asigne llaves de control vinculadas directamente con el interceptor de rutas del middleware (proxy.ts).
          </p>
        </div>

        <div className="flex items-center gap-2 bg-zinc-50 p-1 rounded-xl w-fit border border-zinc-100">
          <Select value={rolSeleccionadoId} onValueChange={setRolSeleccionadoId}>
            <SelectTrigger className="h-8 text-xs rounded-lg border-transparent bg-transparent font-bold text-dark-primary focus:ring-0 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.map((r) => (
                <SelectItem key={r.id} value={r.id} className="text-xs font-bold cursor-pointer">
                  {r.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-100 flex items-start gap-2.5">
        <ShieldAlert className="h-4 w-4 text-dark-secondary mt-0.5 shrink-0" />
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-dark-primary">Alcance del Rol Seleccionado</span>
          <p className="text-[11px] text-dark-secondary leading-relaxed">{rolActual.descripcion}</p>
        </div>
      </div>

      <form onSubmit={handleGuardarMatriz} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PERMISOS_SISTEMA.map((permiso) => {
            const tieneAcceso = rolActual.permisos.includes(permiso.llave);
            const isAdmin = rolActual.nombre.toLowerCase() === "administrador" || rolActual.nombre.toLowerCase() === "admin";

            return (
              <div
                key={permiso.id}
                onClick={() => handleTogglePermiso(permiso.llave)}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 ${
                  tieneAcceso
                    ? "bg-brand-blue border-brand-blue text-white shadow-sm"
                    : "bg-white border-zinc-200/70 text-dark-primary hover:border-zinc-300"
                }`}
              >
                <div className="flex flex-col gap-1 pointer-events-none">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">{permiso.nombre}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                      tieneAcceso ? "bg-white/20 text-blue-100" : "bg-zinc-100 text-dark-secondary"
                    }`}>
                      {permiso.llave}
                    </span>
                  </div>
                  <p className={`text-[10px] leading-snug ${tieneAcceso ? "text-blue-100" : "text-dark-secondary"}`}>
                    {permiso.descripcion}
                  </p>
                </div>

                <div className="shrink-0 pointer-events-none">
                  {isAdmin ? (
                    <Lock className="h-4 w-4 text-white/50" />
                  ) : tieneAcceso ? (
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-zinc-200" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end border-t border-zinc-100 pt-4">
          <Button
            type="submit"
            disabled={isPending || rolActual.nombre.toLowerCase() === "administrador"}
            className="bg-brand-blue hover:bg-blue-600 text-white font-semibold rounded-xl text-xs flex items-center gap-2 h-9 px-4 shadow-md shadow-brand-blue/15 transition-all cursor-pointer"
          >
            {isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            Actualizar Restricciones
          </Button>
        </div>
      </form>
    </div>
  );
}
