"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Edit,
  Mail,
  Briefcase,
  UserCheck2,
  Phone,
  Loader2,
} from "lucide-react";
import { useUpdateUserMutation } from "@/modules/user/domain/hooks/useUpdateUserMutation";
import { useGetRolesQuery } from "@/modules/role/domain/hooks/useRoleQueries";
import { User } from "@/core/user/interfaces";

interface UpdateUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export function UpdateUserDialog({
  isOpen,
  onOpenChange,
  user,
}: UpdateUserDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState<string>("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Guardamos el ID del usuario anterior para detectar cambios de prop durante el renderizado
  const [prevUserId, setPrevUserId] = useState<number | null>(null);

  const { data: roles = [] } = useGetRolesQuery();
  const updateUserMutation = useUpdateUserMutation();

  // Ajustar el estado síncronamente cuando el usuario cambia o el diálogo se abre
  // Esta es la forma recomendada por React para ajustar estado basado en props sin causar renders en cascada
  if (user && user.id !== prevUserId && isOpen) {
    setPrevUserId(user.id);
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setEmail(user.email || "");
    setRoleId(user.role?.toString() || "");
    setPhone(user.phone || "");
    setErrors({});
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!firstName.trim()) newErrors.firstName = "El nombre es obligatorio.";
    if (!lastName.trim()) newErrors.lastName = "El apellido es obligatorio.";
    if (!email.trim()) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "El formato de correo no es válido.";
    }
    if (!roleId) newErrors.roleId = "El rol es obligatorio.";
    if (!phone.trim()) newErrors.phone = "El teléfono es obligatorio.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!validateForm()) {
      toast.error("Formulario Inválido", {
        description: "Por favor, corrija los campos resaltados en rojo.",
      });
      return;
    }

    updateUserMutation.mutate(
      {
        id: user.id,
        email,
        firstName,
        lastName,
        role: parseInt(roleId),
        phone,
      },
      {
        onSuccess: () => {
          toast.success("Personal Actualizado", {
            description: `Se han guardado los cambios para ${firstName} ${lastName}.`,
          });
          onOpenChange(false);
        },
        onError: (e) => {
          toast.error("Error al actualizar personal", {
            description: e.message || "No se pudo conectar con el servidor.",
          });
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white rounded-3xl border border-zinc-100 shadow-2xl p-0 overflow-hidden isolate">
        {/* Cabecera Premium */}
        <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 p-6 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-6 opacity-10">
            <Edit className="h-40 w-40" />
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/20">
              <UserCheck2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-extrabold tracking-tight">
                Editar Información de Personal
              </DialogTitle>
              <DialogDescription className="text-white/80 text-xs mt-1 font-medium">
                Actualice los datos básicos y el rol asignado al colaborador.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {/* Nombres y Apellidos */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="edit-firstName"
                className="text-xs font-bold text-dark-primary flex items-center gap-1.5"
              >
                Nombre
              </Label>
              <Input
                id="edit-firstName"
                placeholder="Ej. Alexander"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (errors.firstName)
                    setErrors((prev) => ({ ...prev, firstName: "" }));
                }}
                className={`rounded-xl border h-10 text-xs px-4 bg-zinc-50/50 focus:bg-white focus:border-zinc-300 transition-all outline-none ${
                  errors.firstName ? "border-red-400" : "border-zinc-200"
                }`}
              />
              {errors.firstName && (
                <span className="text-[10px] text-red-500 font-medium">
                  {errors.firstName}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="edit-lastName"
                className="text-xs font-bold text-dark-primary"
              >
                Apellido
              </Label>
              <Input
                id="edit-lastName"
                placeholder="Ej. Chevalier"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (errors.lastName)
                    setErrors((prev) => ({ ...prev, lastName: "" }));
                }}
                className={`rounded-xl border h-10 text-xs px-4 bg-zinc-50/50 focus:bg-white focus:border-zinc-300 transition-all outline-none ${
                  errors.lastName ? "border-red-400" : "border-zinc-200"
                }`}
              />
              {errors.lastName && (
                <span className="text-[10px] text-red-500 font-medium">
                  {errors.lastName}
                </span>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="edit-email"
              className="text-xs font-bold text-dark-primary flex items-center gap-1.5"
            >
              <Mail className="h-3.5 w-3.5 text-zinc-400" /> Correo Electrónico
            </Label>
            <Input
              id="edit-email"
              type="email"
              placeholder="a.chevalier@grandconcierge.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              className={`rounded-xl border h-10 text-xs px-4 bg-zinc-50/50 focus:bg-white focus:border-zinc-300 transition-all outline-none ${
                errors.email ? "border-red-400" : "border-zinc-200"
              }`}
            />
            {errors.email && (
              <span className="text-[10px] text-red-500 font-medium">
                {errors.email}
              </span>
            )}
          </div>

          {/* Rol y Teléfono */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="edit-role"
                className="text-xs font-bold text-dark-primary flex items-center gap-1.5"
              >
                <Briefcase className="h-3.5 w-3.5 text-zinc-400" /> Rol
              </Label>
              <Select
                value={roleId}
                onValueChange={(val) => {
                  setRoleId(val);
                  if (errors.roleId)
                    setErrors((prev) => ({ ...prev, roleId: "" }));
                }}
              >
                <SelectTrigger
                  className={`h-10 text-xs rounded-xl bg-zinc-50/50 ${errors.roleId ? "border-red-400" : "border-zinc-200"}`}
                >
                  <SelectValue placeholder="Seleccione..." />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl border border-zinc-100 shadow-xl">
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id.toString()}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.roleId && (
                <span className="text-[10px] text-red-500 font-medium">
                  {errors.roleId}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="edit-phone"
                className="text-xs font-bold text-dark-primary flex items-center gap-1.5"
              >
                <Phone className="h-3.5 w-3.5 text-zinc-400" /> Teléfono
              </Label>
              <Input
                id="edit-phone"
                placeholder="+51 987..."
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone)
                    setErrors((prev) => ({ ...prev, phone: "" }));
                }}
                className={`rounded-xl border h-10 text-xs px-4 bg-zinc-50/50 focus:bg-white focus:border-zinc-300 transition-all outline-none ${
                  errors.phone ? "border-red-400" : "border-zinc-200"
                }`}
              />
              {errors.phone && (
                <span className="text-[10px] text-red-500 font-medium">
                  {errors.phone}
                </span>
              )}
            </div>
          </div>

          {/* Footer del Dialog */}
          <DialogFooter className="mt-4 flex sm:flex-row gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-xs font-bold text-dark-secondary hover:bg-zinc-100 rounded-xl px-4 h-10 transition-all"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateUserMutation.isPending}
              className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl text-xs px-6 h-10 shadow-lg shadow-zinc-900/10 transition-all flex items-center gap-2"
            >
              {updateUserMutation.isPending && (
                <Loader2 className="h-3 w-3 animate-spin" />
              )}
              {updateUserMutation.isPending
                ? "Guardando..."
                : "Actualizar Colaborador"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
