"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Edit, Loader2, ShieldCheck } from "lucide-react";
import { useUpdateRoleMutation } from "@/modules/role/domain/hooks/useUpdateRoleMutation";
import { Role } from "@/core/role/interfaces";

interface UpdateRoleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
}

export function UpdateRoleDialog({
  isOpen,
  onOpenChange,
  role,
}: UpdateRoleDialogProps) {
  const [name, setName] = useState(role?.name || "");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const updateRoleMutation = useUpdateRoleMutation();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "El nombre del rol es obligatorio.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    if (!validateForm()) {
      toast.error("Formulario Inválido", {
        description: "Por favor, corrija los errores.",
      });
      return;
    }

    updateRoleMutation.mutate(
      {
        id: role.id,
        name,
        permission_ids: role.permissions.map((p) => p.id), // enviamos los mismos para no perderlos
      },
      {
        onSuccess: () => {
          toast.success("Rol Actualizado", {
            description: `Se han guardado los cambios para el rol ${name}.`,
          });
          onOpenChange(false);
        },
        onError: (e) => {
          toast.error("Error al actualizar rol", {
            description: e.message || "No se pudo conectar con el servidor.",
          });
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white rounded-3xl border border-zinc-100 shadow-2xl p-0 overflow-hidden isolate">
        {/* Cabecera */}
        <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 p-6 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-6 opacity-10">
            <Edit className="h-40 w-40" />
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/20">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-extrabold tracking-tight">
                Editar Rol
              </DialogTitle>
              <DialogDescription className="text-white/80 text-xs mt-1 font-medium">
                Edita la información básica del rol.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="name"
              className="text-xs font-bold text-dark-primary flex items-center gap-1.5"
            >
              Nombre del Rol
              {errors.name && (
                <span className="text-red-500 font-medium ml-1">*</span>
              )}
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Administrador, Recepcionista..."
              className={`h-11 rounded-xl text-[13px] font-semibold border ${
                errors.name
                  ? "border-red-500 focus-visible:ring-red-500 bg-red-50/50"
                  : "border-zinc-200 focus-visible:ring-brand-blue bg-zinc-50/50"
              }`}
            />
            {errors.name && (
              <span className="text-[10px] font-bold text-red-500 mt-1 pl-1">
                {errors.name}
              </span>
            )}
          </div>

          {/* Botonera */}
          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-zinc-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl h-11 px-5 border-zinc-200 text-dark-secondary font-bold text-[13px] hover:bg-zinc-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateRoleMutation.isPending}
              className="bg-brand-blue hover:bg-blue-600 text-white rounded-xl h-11 px-6 font-bold text-[13px] shadow-lg shadow-brand-blue/20"
            >
              {updateRoleMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {updateRoleMutation.isPending
                ? "Guardando..."
                : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
