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
  UserPlus2,
  Mail,
  Hash,
  UserCheck,
  Phone,
  FileText,
  Loader2,
} from "lucide-react";
import { useCreateGuestMutation } from "@/modules/guest/domain/hooks/useGuestMutations";

interface CreateGuestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateGuestDialog({
  isOpen,
  onOpenChange,
}: CreateGuestDialogProps) {
  const createGuestMutation = useCreateGuestMutation();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("DNI");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [notas, setNotas] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!apellido.trim()) newErrors.apellido = "El apellido es obligatorio.";
    if (!documento.trim()) newErrors.documento = "El documento es obligatorio.";
    if (!email.trim()) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "El formato de correo no es válido.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    createGuestMutation.mutate(
      {
        nombre,
        apellido,
        email,
        tipo_documento: tipoDocumento,
        documento,
        telefono,
        preferencias_notas: notas,
      },
      {
        onSuccess: () => {
          toast.success("Huésped Registrado Exitosamente", {
            description: `Se ha creado el registro para ${nombre} ${apellido} con éxito.`,
          });
          resetForm();
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error("Error al registrar huésped", {
            description: error.message || "Ocurrió un problema en el servidor.",
          });
        },
      },
    );
  };

  const resetForm = () => {
    setNombre("");
    setApellido("");
    setEmail("");
    setTipoDocumento("DNI");
    setDocumento("");
    setTelefono("");
    setNotas("");
    setErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white rounded-3xl border border-zinc-100 shadow-2xl p-0 overflow-hidden isolate">
        {/* Cabecera Premium */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-6 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-6 opacity-10">
            <UserPlus2 className="h-40 w-40" />
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/20">
              <UserPlus2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-extrabold tracking-tight">
                Registrar Nuevo Huésped
              </DialogTitle>
              <DialogDescription className="text-white/80 text-xs mt-1 font-medium">
                Ingrese los datos del cliente para su registro en el sistema.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="nombre"
                className="text-xs font-bold text-dark-primary"
              >
                Nombre
              </Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className={`rounded-xl border h-10 text-xs ${errors.nombre ? "border-red-400" : "border-zinc-200"}`}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="apellido"
                className="text-xs font-bold text-dark-primary"
              >
                Apellido
              </Label>
              <Input
                id="apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className={`rounded-xl border h-10 text-xs ${errors.apellido ? "border-red-400" : "border-zinc-200"}`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="email"
              className="text-xs font-bold text-dark-primary"
            >
              Correo Electrónico
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`rounded-xl border h-10 text-xs ${errors.email ? "border-red-400" : "border-zinc-200"}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-dark-primary">
                Tipo Documento
              </Label>
              <Select value={tipoDocumento} onValueChange={setTipoDocumento}>
                <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DNI">DNI</SelectItem>
                  <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
                  <SelectItem value="CE">CE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="doc"
                className="text-xs font-bold text-dark-primary"
              >
                N° Documento
              </Label>
              <Input
                id="doc"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                className={`rounded-xl border h-10 text-xs ${errors.documento ? "border-red-400" : "border-zinc-200"}`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="tel"
              className="text-xs font-bold text-dark-primary"
            >
              Teléfono
            </Label>
            <Input
              id="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="rounded-xl border h-10 text-xs border-zinc-200"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="notas"
              className="text-xs font-bold text-dark-primary"
            >
              Notas / Preferencias
            </Label>
            <textarea
              id="notas"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className="rounded-xl border p-3 text-xs border-zinc-200 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="Ej. Alérgico a las nueces, prefiere piso alto..."
            />
          </div>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-xs font-bold"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createGuestMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs px-6 shadow-lg shadow-emerald-600/15"
            >
              {createGuestMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Guardar Huésped"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
