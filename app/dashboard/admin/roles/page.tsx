"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  ShieldCheck,
  ChevronRight,
  UserCheck2,
  Briefcase,
  AlertTriangle,
  Star,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateRoleDialog } from "@/presentation/dashboard/admin/roles/create-role-dialog";
import { toast } from "sonner";
import {
  useGetRolesQuery,
  useGetPermissionsQuery,
} from "@/modules/role/domain/hooks/useRoleQueries";
import { useUpdateRoleMutation } from "@/modules/role/domain/hooks/useUpdateRoleMutation";

export default function RolesManagementPage() {
  const { data: session } = useSession();
  const [activeRoleId, setActiveRoleId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [modifiedPerms, setModifiedPerms] = useState<{
    roleId: number;
    permIds: number[];
  } | null>(null);

  const { data: roles = [], isLoading: isLoadingRoles } = useGetRolesQuery();
  const { data: permissions = [], isLoading: isLoadingPermissions } = useGetPermissionsQuery();

  const updateRoleMutation = useUpdateRoleMutation();

  const isLoading = isLoadingRoles || isLoadingPermissions;

  const effectiveActiveRoleId =
    activeRoleId ?? (roles.length > 0 ? roles[0].id : null);
  const activeRole = roles.find((r) => r.id === effectiveActiveRoleId);

  const currentPermIds =
    modifiedPerms?.roleId === effectiveActiveRoleId
      ? modifiedPerms.permIds
      : activeRole?.permissions.map((p) => p.id) || [];

  const handleSelectRole = (roleId: number) => {
    setActiveRoleId(roleId);
  };

  // Mapeamos los íconos dinámicamente si queremos
  const getRoleIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("admin")) return <ShieldCheck className="h-5 w-5" />;
    if (lower.includes("recep")) return <UserCheck2 className="h-5 w-5" />;
    if (lower.includes("mantenimiento") || lower.includes("op"))
      return <AlertTriangle className="h-5 w-5" />;
    return <Briefcase className="h-5 w-5" />;
  };

  const togglePermission = (permId: number) => {
    if (!activeRole) return;
    const baseIds =
      modifiedPerms?.roleId === activeRole.id
        ? modifiedPerms.permIds
        : activeRole.permissions.map((p) => p.id);

    const nextIds = baseIds.includes(permId)
      ? baseIds.filter((id) => id !== permId)
      : [...baseIds, permId];

    setModifiedPerms({ roleId: activeRole.id, permIds: nextIds });
  };

  const handleSaveChanges = () => {
    if (!activeRole) return;
    updateRoleMutation.mutate(
      {
        id: activeRole.id,
        name: activeRole.name,
        permission_ids: currentPermIds,
      },
      {
        onSuccess: () => {
          toast.success("Permisos actualizados correctamente");
          setModifiedPerms(null);
        },
        onError: (e) => {
          toast.error(e.message || "Error al actualizar los permisos");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 animate-fade-in pb-8">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 animate-pulse">
          <div className="flex flex-col gap-2 w-full max-w-xl">
            <div className="h-8 bg-zinc-200 rounded-xl w-48"></div>
            <div className="h-4 bg-zinc-100 rounded-lg w-full max-w-lg mt-1"></div>
            <div className="h-4 bg-zinc-100 rounded-lg w-4/5"></div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-10 bg-zinc-100 rounded-xl w-32 border border-zinc-200"></div>
            <div className="h-10 bg-blue-100 rounded-xl w-36"></div>
          </div>
        </div>

        {/* Layout Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4 animate-pulse">
            <div className="h-3 bg-zinc-200 rounded-md w-28 ml-1"></div>
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-white rounded-2xl border border-zinc-100 p-4 flex items-center justify-between shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-zinc-100 rounded-xl"></div>
                    <div className="flex flex-col gap-1.5">
                      <div className="h-4 bg-zinc-200 rounded-lg w-28"></div>
                      <div className="h-3 bg-zinc-100 rounded-md w-16"></div>
                    </div>
                  </div>
                  <div className="h-4 w-4 bg-zinc-100 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Grid Skeleton */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6 animate-pulse">
            <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-zinc-100 rounded-2xl"></div>
                  <div className="flex flex-col gap-1.5">
                    <div className="h-5 bg-zinc-200 rounded-lg w-40"></div>
                    <div className="h-3 bg-zinc-100 rounded-md w-60"></div>
                  </div>
                </div>
                <div className="h-8 bg-zinc-100 rounded-xl w-24"></div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="h-4 bg-zinc-200 rounded-md w-36 ml-1"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="bg-zinc-50/50 rounded-2xl p-4 border border-zinc-100 flex items-center justify-between"
                    >
                      <div className="flex flex-col gap-1.5 w-full">
                        <div className="h-4 bg-zinc-200 rounded-md w-32"></div>
                        <div className="h-3 bg-zinc-100 rounded-md w-48"></div>
                      </div>
                      <div className="h-5 w-8 bg-zinc-200 rounded-full shrink-0 ml-4"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5 max-w-2xl">
          <h2 className="text-[26px] font-extrabold tracking-tight text-dark-primary">
            Roles y Permisos
          </h2>
          <p className="text-dark-secondary text-[13px] leading-relaxed font-medium">
            Define la jerarquía organizacional y los niveles de acceso para el
            ecosistema de gestión de Grand Concierge. Ceder capacidades
            específicas para cada nivel de personal.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            className="border-zinc-200 bg-white hover:bg-zinc-50 text-dark-primary font-bold text-xs rounded-xl px-5 h-10 shadow-xs"
            onClick={() => toast("Exportando log de auditoría...")}
          >
            Exportar Log de
            <br />
            Auditoría
          </Button>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 px-5 h-10 shadow-lg shadow-brand-blue/15 transition-all"
          >
            <ShieldCheck className="h-4 w-4" />
            Crear Nuevo Rol
          </Button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Jerarquía de Personal */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-4">
          <h3 className="text-[11px] font-extrabold text-dark-secondary tracking-widest uppercase pl-1">
            Jerarquía de Personal
          </h3>

          <div className="flex flex-col gap-3">
            {roles.map((role) => {
              const isActive = effectiveActiveRoleId === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => handleSelectRole(role.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                    isActive
                      ? "bg-[#eef2ff] border-brand-blue/30 shadow-sm"
                      : "bg-white border-zinc-100 hover:border-zinc-200 hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive
                          ? "bg-brand-blue text-white shadow-md shadow-brand-blue/20"
                          : "bg-zinc-100 text-dark-secondary"
                      }`}
                    >
                      {getRoleIcon(role.name)}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span
                        className={`text-[13px] font-extrabold ${isActive ? "text-brand-blue" : "text-dark-primary"}`}
                      >
                        {role.name}
                      </span>
                      <span
                        className={`text-[11px] font-medium ${isActive ? "text-blue-600/80" : "text-dark-secondary"}`}
                      >
                        {role.permissions.length} Permisos asignados
                      </span>
                    </div>
                  </div>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-brand-blue shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tarjeta inferior de Usuarios Globales */}
          <div className="mt-2 bg-[#002f6c] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col gap-4">
            <div className="absolute -right-6 -bottom-6 opacity-10 rotate-12">
              <ShieldCheck className="h-32 w-32" />
            </div>

            <div className="relative z-10 flex flex-col gap-1">
              <span className="text-[11px] font-medium text-white/70">
                Roles Configurados
              </span>
              <span className="text-4xl font-extrabold tracking-tight">
                {roles.length}
              </span>
            </div>

            <div className="relative z-10 flex items-center gap-2 text-[11px] font-semibold text-blue-200 bg-white/10 w-fit px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              Sincronizado con API
            </div>
          </div>
        </div>

        {/* Right Column: Editor de Permisos */}
        <div className="lg:col-span-8 xl:col-span-9 bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm flex flex-col gap-8">
          {/* Header del Editor */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-zinc-100 pb-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="bg-[#00d084] text-white text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-sm">
                  Directiva Actual
                </span>
                <span className="text-[11px] font-medium text-dark-secondary">
                  Modificado recientemente
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-dark-primary tracking-tight">
                Permisos de {activeRole?.name || ""}
              </h2>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <Button
                disabled={updateRoleMutation.isPending}
                onClick={handleSaveChanges}
                className="bg-[#121b2d] hover:bg-black text-white font-bold rounded-xl text-xs px-6 h-11 shadow-lg shadow-dark-primary/10 transition-all flex items-center gap-2"
              >
                {updateRoleMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {updateRoleMutation.isPending ? (
                  "Guardando..."
                ) : (
                  <>
                    Guardar
                    <br />
                    Cambios
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Lista de Permisos */}
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                  <Star className="h-4.5 w-4.5 text-brand-blue" />
                </div>
                <h3 className="text-[15px] font-extrabold text-dark-primary tracking-tight">
                  Módulo de Permisos ({permissions.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {permissions.map((perm) => {
                  const isActive = currentPermIds.includes(perm.id);
                  return (
                    <div
                      key={perm.id}
                      className="flex items-start justify-between gap-4"
                    >
                      <div className="flex flex-col gap-1 max-w-[280px]">
                        <span className="text-[13px] font-bold text-dark-primary">
                          {perm.name}
                        </span>
                        <span className="text-[11px] font-medium text-dark-secondary leading-snug">
                          Codename: {perm.codename}
                        </span>
                      </div>

                      {/* Custom Switch Component */}
                      <button
                        type="button"
                        onClick={() => togglePermission(perm.id)}
                        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ease-in-out cursor-pointer mt-0.5 ${
                          isActive ? "bg-[#1258d1]" : "bg-zinc-200"
                        }`}
                      >
                        <div
                          className={`absolute top-[2px] left-[2px] h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                            isActive ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Nota de Seguridad */}
          <div className="mt-4 bg-[#f0f5ff] border border-[#d6e4ff] rounded-2xl p-5 flex items-start gap-4">
            <div className="h-8 w-8 shrink-0 rounded-full bg-[#d6e4ff] text-[#1258d1] flex items-center justify-center mt-0.5">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <p className="text-xs font-semibold text-[#1d3d7a] leading-relaxed">
              <span className="font-extrabold">Nota de Seguridad:</span>{" "}
              Modificar los permisos de la infraestructura principal activará
              una re-autenticación del sistema para todos los usuarios con este
              rol.
            </p>
          </div>
        </div>
      </div>

      <CreateRoleDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        availablePermissions={permissions}
      />
    </div>
  );
}
