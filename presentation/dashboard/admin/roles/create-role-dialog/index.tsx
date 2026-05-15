"use client";

import { useState } from "react";
import { X, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { useCreateRoleMutation } from "@/modules/role/domain/hooks/useCreateRoleMutation";
import { toast } from "sonner";

interface CreateRoleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  availablePermissions: { id: number; name: string; codename: string }[];
}

export function CreateRoleDialog({
  isOpen,
  onOpenChange,
  availablePermissions,
}: CreateRoleDialogProps) {
  const createRoleMutation = useCreateRoleMutation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => {
        setName("");
        setDescription("");
        setSelectedPermissions([]);
        setErrors({});
      }, 200);
    }
    onOpenChange(open);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "El nombre del rol es obligatorio.";
    if (selectedPermissions.length === 0)
      newErrors.permissions = "Debe seleccionar al menos un permiso.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    createRoleMutation.mutate(
      {
        name,
        permission_ids: selectedPermissions,
      },
      {
        onSuccess: () => {
          toast.success("Rol creado exitosamente");
          handleOpenChange(false);
        },
        onError: (e) => {
          toast.error(e.message || "Error de conexión al crear el rol");
        },
      },
    );
  };

  const togglePermission = (id: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const getModuleForPermission = (codename: string) => {
    if (codename.includes("manage_users") || codename.includes("manage_roles"))
      return "Administración";
    if (codename.includes("clean") || codename.includes("maintenance"))
      return "Operaciones";
    if (codename.includes("inventory") || codename.includes("reservations"))
      return "Recepción/Logística";
    if (codename.includes("reports")) return "Directivo";
    return "Permisos del Sistema";
  };

  const groupedPermissions = availablePermissions.reduce(
    (acc, perm) => {
      const category = getModuleForPermission(perm.codename);
      if (!acc[category]) acc[category] = [];
      acc[category].push(perm);
      return acc;
    },
    {} as Record<string, typeof availablePermissions>,
  );

  const toggleModule = (moduleName: string) => {
    const modulePermIds = groupedPermissions[moduleName].map((p) => p.id);
    const allSelected = modulePermIds.every((id) =>
      selectedPermissions.includes(id),
    );

    if (allSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((id) => !modulePermIds.includes(id)),
      );
    } else {
      setSelectedPermissions((prev) => {
        const newSet = new Set([...prev, ...modulePermIds]);
        return Array.from(newSet);
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white rounded-3xl border border-zinc-100 shadow-2xl p-0 overflow-hidden isolate">
        {/* Cabecera Premium */}
        <div className="bg-gradient-to-r from-brand-blue to-blue-600 p-6 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-6 opacity-10">
            <ShieldCheck className="h-40 w-40" />
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/20">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-extrabold tracking-tight">
                Crear Nuevo Rol
              </DialogTitle>
              <DialogDescription className="text-white/80 text-xs mt-1 font-medium">
                Define un nuevo conjunto de permisos para el personal.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Contenido del Formulario */}
        <div className="overflow-y-auto max-h-[60vh] px-8 py-6">
          <form
            id="create-role-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="text-xs font-bold text-dark-primary ml-1"
                >
                  Nombre del Rol
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name)
                      setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  placeholder="Ej. Gerente de Operaciones"
                  className={`h-11 rounded-xl bg-zinc-50 border-transparent hover:bg-zinc-100 focus:bg-white transition-all text-sm ${errors.name ? "border-red-400 focus:border-red-400 focus:ring-red-500/10" : ""}`}
                />
                {errors.name && (
                  <span className="text-[10px] font-semibold text-red-500 ml-1">
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="description"
                  className="text-xs font-bold text-dark-primary ml-1"
                >
                  Descripción Corta
                </label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Breve descripción de sus funciones"
                  className="h-11 rounded-xl bg-zinc-50 border-transparent hover:bg-zinc-100 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-extrabold text-dark-primary">
                  Permisos de Acceso
                </label>
                {errors.permissions && (
                  <span className="text-[10px] font-semibold text-red-500">
                    {errors.permissions}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 border border-zinc-100 rounded-2xl p-4 bg-zinc-50/50">
                {Object.entries(groupedPermissions).map(([category, perms]) => {
                  const modulePermIds = perms.map((p) => p.id);
                  const allSelected = modulePermIds.every((id) =>
                    selectedPermissions.includes(id),
                  );
                  const someSelected =
                    modulePermIds.some((id) =>
                      selectedPermissions.includes(id),
                    ) && !allSelected;

                  return (
                    <div key={category} className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleModule(category)}
                          className={`h-4 w-4 rounded-md border flex items-center justify-center transition-colors ${
                            allSelected
                              ? "bg-brand-blue border-brand-blue text-white"
                              : someSelected
                                ? "bg-brand-blue/20 border-brand-blue/50 text-brand-blue"
                                : "border-zinc-300 bg-white"
                          }`}
                        >
                          {(allSelected || someSelected) && (
                            <CheckIcon className="h-3 w-3" />
                          )}
                        </button>
                        <span className="text-xs font-extrabold text-dark-primary uppercase tracking-wider">
                          {category}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6">
                        {perms.map((perm) => {
                          const isSelected = selectedPermissions.includes(
                            perm.id,
                          );
                          return (
                            <div
                              key={perm.id}
                              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                isSelected
                                  ? "bg-white border-brand-blue/30 shadow-sm"
                                  : "bg-white border-zinc-100 hover:border-zinc-200"
                              }`}
                              onClick={() => togglePermission(perm.id)}
                            >
                              <div
                                className={`mt-0.5 h-4 w-4 rounded-[4px] border flex-shrink-0 flex items-center justify-center transition-colors ${
                                  isSelected
                                    ? "bg-brand-blue border-brand-blue text-white"
                                    : "border-zinc-300 bg-white"
                                }`}
                              >
                                {isSelected && (
                                  <CheckIcon className="h-3 w-3" />
                                )}
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span
                                  className={`text-[13px] font-bold ${isSelected ? "text-brand-blue" : "text-dark-primary"}`}
                                >
                                  {perm.name}
                                </span>
                                <span className="text-[10px] font-medium text-dark-secondary leading-tight">
                                  Codename: {perm.codename}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-zinc-100 bg-zinc-50 rounded-b-3xl shrink-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            className="text-xs font-bold text-dark-secondary hover:text-dark-primary hover:bg-zinc-200/50 rounded-xl px-5"
          >
            Cancelar
          </Button>
          <Button
            form="create-role-form"
            type="submit"
            disabled={createRoleMutation.isPending}
            className="bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold rounded-xl px-6 py-2.5 shadow-lg shadow-brand-blue/20 flex items-center gap-2"
          >
            {createRoleMutation.isPending && (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            )}
            {createRoleMutation.isPending ? "Creando..." : "Crear Rol"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={3}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}
