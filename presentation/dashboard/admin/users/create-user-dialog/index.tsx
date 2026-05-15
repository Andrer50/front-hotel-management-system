"use client";

import React, { useState } from "react";
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
  UserPlus,
  Mail,
  Briefcase,
  UserCheck2,
  Lock,
  Phone,
  Loader2,
} from "lucide-react";
import { useCreateUserMutation } from "@/modules/user/domain/hooks/useCreateUserMutation";
import { useGetRolesQuery } from "@/modules/role/domain/hooks/useRoleQueries";

interface CreateUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserDialog({
  isOpen,
  onOpenChange,
}: CreateUserDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState<string>("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { data: roles = [] } = useGetRolesQuery();
  const createUserMutation = useCreateUserMutation();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!firstName.trim()) newErrors.firstName = "El nombre es obligatorio.";
    if (!lastName.trim()) newErrors.lastName = "El apellido es obligatorio.";
    if (!email.trim()) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "El formato de correo no es válido.";
    }
    if (!password.trim()) newErrors.password = "La contraseña es obligatoria.";
    if (!roleId) newErrors.roleId = "El rol es obligatorio.";
    if (!phone.trim()) newErrors.phone = "El teléfono es obligatorio.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Formulario Inválido", {
        description: "Por favor, corrija los campos resaltados en rojo.",
      });
      return;
    }

    createUserMutation.mutate(
      {
        email,
        password,
        firstName,
        lastName,
        role: parseInt(roleId),
        phone,
      },
      {
        onSuccess: () => {
          toast.success("Personal Registrado Exitosamente", {
            description: `Se ha registrado a ${firstName} ${lastName} correctamente.`,
          });

          // Resetear formulario
          setFirstName("");
          setLastName("");
          setEmail("");
          setPassword("");
          setRoleId("");
          setPhone("");
          setErrors({});
          onOpenChange(false);
        },
        onError: (e) => {
          toast.error("Error al registrar personal", {
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
        <div className="bg-gradient-to-r from-brand-blue to-blue-600 p-6 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-6 opacity-10">
            <UserPlus className="h-40 w-40" />
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/20">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-extrabold tracking-tight">
                Registrar Nuevo Personal
              </DialogTitle>
              <DialogDescription className="text-white/80 text-xs mt-1 font-medium">
                Complete el formulario para dar de alta un nuevo miembro del
                equipo.
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
                htmlFor="firstName"
                className="text-xs font-bold text-dark-primary flex items-center gap-1.5"
              >
                <UserCheck2 className="h-3.5 w-3.5 text-brand-blue" /> Nombre
              </Label>
              <Input
                id="firstName"
                placeholder="Ej. Alexander"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (errors.firstName)
                    setErrors((prev) => ({ ...prev, firstName: "" }));
                }}
                className={`rounded-xl border h-10 text-xs px-4 bg-zinc-50/50 focus:bg-white focus:border-brand-blue/30 transition-all outline-none ${
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
                htmlFor="lastName"
                className="text-xs font-bold text-dark-primary"
              >
                Apellido
              </Label>
              <Input
                id="lastName"
                placeholder="Ej. Chevalier"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (errors.lastName)
                    setErrors((prev) => ({ ...prev, lastName: "" }));
                }}
                className={`rounded-xl border h-10 text-xs px-4 bg-zinc-50/50 focus:bg-white focus:border-brand-blue/30 transition-all outline-none ${
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
              htmlFor="email"
              className="text-xs font-bold text-dark-primary flex items-center gap-1.5"
            >
              <Mail className="h-3.5 w-3.5 text-brand-blue" /> Correo
              Electrónico
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="a.chevalier@grandconcierge.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              className={`rounded-xl border h-10 text-xs px-4 bg-zinc-50/50 focus:bg-white focus:border-brand-blue/30 transition-all outline-none ${
                errors.email ? "border-red-400" : "border-zinc-200"
              }`}
            />
            {errors.email && (
              <span className="text-[10px] text-red-500 font-medium">
                {errors.email}
              </span>
            )}
          </div>

          {/* Contraseña */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="password"
              className="text-xs font-bold text-dark-primary flex items-center gap-1.5"
            >
              <Lock className="h-3.5 w-3.5 text-brand-blue" /> Contraseña
              Inicial
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password)
                  setErrors((prev) => ({ ...prev, password: "" }));
              }}
              className={`rounded-xl border h-10 text-xs px-4 bg-zinc-50/50 focus:bg-white focus:border-brand-blue/30 transition-all outline-none ${
                errors.password ? "border-red-400" : "border-zinc-200"
              }`}
            />
            {errors.password && (
              <span className="text-[10px] text-red-500 font-medium">
                {errors.password}
              </span>
            )}
          </div>

          {/* Rol y Teléfono */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="role"
                className="text-xs font-bold text-dark-primary flex items-center gap-1.5"
              >
                <Briefcase className="h-3.5 w-3.5 text-brand-blue" /> Rol
                Asignado
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
                htmlFor="phone"
                className="text-xs font-bold text-dark-primary flex items-center gap-1.5"
              >
                <Phone className="h-3.5 w-3.5 text-brand-blue" /> Teléfono
              </Label>
              <Input
                id="phone"
                placeholder="+51 987..."
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone)
                    setErrors((prev) => ({ ...prev, phone: "" }));
                }}
                className={`rounded-xl border h-10 text-xs px-4 bg-zinc-50/50 focus:bg-white focus:border-brand-blue/30 transition-all outline-none ${
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
              disabled={createUserMutation.isPending}
              className="bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-xs px-6 h-10 shadow-lg shadow-brand-blue/15 transition-all flex items-center gap-2"
            >
              {createUserMutation.isPending && (
                <Loader2 className="h-3 w-3 animate-spin" />
              )}
              {createUserMutation.isPending
                ? "Registrando..."
                : "Guardar Personal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
