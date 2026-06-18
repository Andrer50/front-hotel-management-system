"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  User,
  Mail,
  Loader2,
  Sparkles,
  Hash,
  Phone,
} from "lucide-react";
import { Guest } from "@/core/guest/interfaces";
import { Status } from "@/core/shared";
import { useUpdateGuestMutation } from "@/modules/guest/domain/hooks/useGuestMutations";

interface EditGuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guest: Guest | null;
}

export function EditGuestDialog({
  open,
  onOpenChange,
  guest,
}: EditGuestDialogProps) {
  const updateMutation = useUpdateGuestMutation();

  const [nombre, setNombre] = useState(guest?.nombre || "");
  const [apellido, setApellido] = useState(guest?.apellido || "");
  const [email, setEmail] = useState(guest?.email || "");
  const [tipoDocumento, setTipoDocumento] = useState(
    guest?.tipo_documento || "",
  );
  const [documento, setDocumento] = useState(guest?.documento || "");
  const [telefono, setTelefono] = useState(guest?.telefono || "");
  const [status, setStatus] = useState<Status>(guest?.status || "ACTIVE");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !guest ||
      !nombre.trim() ||
      !apellido.trim() ||
      !email.trim() ||
      !documento.trim()
    )
      return;

    updateMutation.mutate(
      {
        id: guest.id,
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: email.trim(),
        tipo_documento: tipoDocumento,
        documento: documento.trim(),
        telefono: telefono.trim(),
        status,
      },
      {
        onSuccess: () => {
          toast.success("Huésped Actualizado", {
            description: `Los datos de ${nombre} se han actualizado correctamente.`,
          });
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error("Error al actualizar", {
            description: error.message || "Ocurrió un problema en el servidor.",
          });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-8 pb-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue shadow-sm">
              <User className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black text-dark-primary tracking-tighter">
                Editar Huésped
              </DialogTitle>
              <DialogDescription className="text-dark-secondary font-medium">
                Actualiza la información personal del cliente.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-8 pt-2 flex flex-col gap-5">
          {/* Fila 1: Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-[11px] font-black uppercase text-dark-secondary tracking-widest ml-1">
                Nombre
              </Label>
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="h-12 rounded-2xl bg-zinc-50 border-zinc-100 focus:bg-white focus:ring-4 focus:ring-brand-blue/5 transition-all font-semibold text-sm"
                placeholder="Nombre"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-[11px] font-black uppercase text-dark-secondary tracking-widest ml-1">
                Apellido
              </Label>
              <Input
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="h-12 rounded-2xl bg-zinc-50 border-zinc-100 focus:bg-white focus:ring-4 focus:ring-brand-blue/5 transition-all font-semibold text-sm"
                placeholder="Apellido"
                required
              />
            </div>
          </div>

          {/* Fila 2: Correo Electrónico */}
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] font-black uppercase text-dark-secondary tracking-widest ml-1">
              Correo Electrónico
            </Label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-brand-blue transition-colors" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 pl-11 rounded-2xl bg-zinc-50 border-zinc-100 focus:bg-white focus:ring-4 focus:ring-brand-blue/5 transition-all font-semibold text-sm"
                placeholder="ejemplo@correo.com"
                required
              />
            </div>
          </div>

          {/* Fila 3: Documento de Identidad */}
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-4 flex flex-col gap-2">
              <Label className="text-[11px] font-black uppercase text-dark-secondary tracking-widest ml-1">
                Tipo Doc.
              </Label>
              <Select value={tipoDocumento} onValueChange={setTipoDocumento}>
                <SelectTrigger className="h-12 rounded-2xl bg-zinc-50 border-zinc-100 focus:bg-white focus:ring-4 focus:ring-brand-blue/5 transition-all font-semibold text-xs text-dark-primary">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent className="bg-white border-zinc-100 rounded-xl shadow-xl">
                  <SelectItem
                    value="DNI"
                    className="font-semibold text-xs py-2.5"
                  >
                    DNI
                  </SelectItem>
                  <SelectItem
                    value="Pasaporte"
                    className="font-semibold text-xs py-2.5"
                  >
                    Pasaporte
                  </SelectItem>
                  <SelectItem
                    value="CE"
                    className="font-semibold text-xs py-2.5"
                  >
                    C. Extranjería
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-8 flex flex-col gap-2">
              <Label className="text-[11px] font-black uppercase text-dark-secondary tracking-widest ml-1">
                Número de Documento
              </Label>
              <div className="relative group">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-brand-blue transition-colors" />
                <Input
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  className="h-12 pl-11 rounded-2xl bg-zinc-50 border-zinc-100 focus:bg-white focus:ring-4 focus:ring-brand-blue/5 transition-all font-semibold text-sm"
                  placeholder="Número de identidad"
                  required
                />
              </div>
            </div>
          </div>

          {/* Fila 4: Teléfono y Estado */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-[11px] font-black uppercase text-dark-secondary tracking-widest ml-1">
                Teléfono de Contacto
              </Label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-brand-blue transition-colors" />
                <Input
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="h-12 pl-11 rounded-2xl bg-zinc-50 border-zinc-100 focus:bg-white focus:ring-4 focus:ring-brand-blue/5 transition-all font-semibold text-sm"
                  placeholder="+51 000 000 000"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-[11px] font-black uppercase text-dark-secondary tracking-widest ml-1">
                Estado del Perfil
              </Label>
              <Select
                value={status}
                onValueChange={(val: Status) => setStatus(val)}
              >
                <SelectTrigger
                  className={`h-12 rounded-2xl bg-zinc-50 border-zinc-100 focus:bg-white focus:ring-4 focus:ring-brand-blue/5 transition-all font-bold text-xs ${status === "ACTIVE" ? "text-brand-blue" : "text-zinc-500"}`}
                >
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent className="bg-white border-zinc-100 rounded-xl shadow-xl">
                  <SelectItem
                    value="ACTIVE"
                    className="font-bold text-xs py-2.5 text-brand-blue"
                  >
                    ACTIVO
                  </SelectItem>
                  <SelectItem
                    value="INACTIVE"
                    className="font-bold text-xs py-2.5 text-zinc-500"
                  >
                    INACTIVO
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-6 gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-2xl font-bold text-dark-secondary hover:bg-zinc-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-brand-blue hover:bg-blue-600 text-white rounded-2xl font-bold px-8 shadow-lg shadow-brand-blue/20 transition-all flex items-center gap-2"
            >
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
