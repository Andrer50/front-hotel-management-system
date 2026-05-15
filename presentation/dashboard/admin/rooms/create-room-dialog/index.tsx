"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
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
  BedDouble,
  Hash,
  Users,
  DollarSign,
  Sparkles,
  Loader2,
  PlusCircle,
} from "lucide-react";
import { useCreateRoomMutation } from "@/modules/room/domain/hooks/useRoomMutations";

interface CreateRoomDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRoomDialog({
  isOpen,
  onOpenChange,
}: CreateRoomDialogProps) {
  const createRoomMutation = useCreateRoomMutation();

  const [numero, setNumero] = useState("");
  const [tipo, setTipo] = useState("INDIVIDUAL");
  const [capacidad, setCapacidad] = useState("1");
  const [precioBase, setPrecioBase] = useState("");
  const [estado, setEstado] = useState("DISPONIBLE");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!numero.trim()) newErrors.numero = "El número es obligatorio.";
    if (!precioBase.trim() || isNaN(Number(precioBase))) {
      newErrors.precioBase = "Ingrese un precio válido.";
    }
    if (!capacidad.trim() || isNaN(Number(capacidad))) {
      newErrors.capacidad = "Ingrese una capacidad válida.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    createRoomMutation.mutate(
      {
        numero,
        tipo,
        capacidad: Number(capacidad),
        precio_base: Number(precioBase),
        estado,
      },
      {
        onSuccess: () => {
          toast.success("Habitación Registrada", {
            description: `La habitación ${numero} ha sido dada de alta exitosamente.`,
          });
          resetForm();
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error("Error al registrar habitación", {
            description: error.message || "Ocurrió un problema en el servidor.",
          });
        },
      },
    );
  };

  const resetForm = () => {
    setNumero("");
    setTipo("INDIVIDUAL");
    setCapacidad("1");
    setPrecioBase("");
    setEstado("DISPONIBLE");
    setErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white rounded-3xl border border-zinc-100 shadow-2xl p-0 overflow-hidden isolate">
        {/* Cabecera Premium */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-500 p-6 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-6 opacity-10">
            <BedDouble className="h-40 w-40" />
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/20">
              <PlusCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-extrabold tracking-tight">
                Nueva Habitación
              </DialogTitle>
              <DialogDescription className="text-white/80 text-xs mt-1 font-medium">
                Configure las especificaciones técnicas del nuevo inventario.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="numero"
                className="text-xs font-bold text-dark-primary flex items-center gap-1.5"
              >
                <Hash className="h-3.5 w-3.5 text-blue-600" /> N° Habitación
              </Label>
              <Input
                id="numero"
                placeholder="Ej. 101"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                className={`rounded-xl border h-10 text-xs ${errors.numero ? "border-red-400" : "border-zinc-200"}`}
              />
              {errors.numero && (
                <span className="text-[10px] text-red-500 font-bold">
                  {errors.numero}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-dark-primary flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" /> Tipo
              </Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                  <SelectItem value="DOBLE">Doble</SelectItem>
                  <SelectItem value="SUITE">Suite</SelectItem>
                  <SelectItem value="FAMILIAR">Familiar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="cap"
                className="text-xs font-bold text-dark-primary flex items-center gap-1.5"
              >
                <Users className="h-3.5 w-3.5 text-blue-600" /> Capacidad
              </Label>
              <Input
                id="cap"
                type="number"
                min="1"
                value={capacidad}
                onChange={(e) => setCapacidad(e.target.value)}
                className={`rounded-xl border h-10 text-xs ${errors.capacidad ? "border-red-400" : "border-zinc-200"}`}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="precio"
                className="text-xs font-bold text-dark-primary flex items-center gap-1.5"
              >
                <DollarSign className="h-3.5 w-3.5 text-blue-600" /> Precio Base
                (S/.)
              </Label>
              <Input
                id="precio"
                placeholder="0.00"
                value={precioBase}
                onChange={(e) => setPrecioBase(e.target.value)}
                className={`rounded-xl border h-10 text-xs ${errors.precioBase ? "border-red-400" : "border-zinc-200"}`}
              />
              {errors.precioBase && (
                <span className="text-[10px] text-red-500 font-bold">
                  {errors.precioBase}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-bold text-dark-primary">
              Estado Inicial
            </Label>
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DISPONIBLE">Disponible / Lista</SelectItem>
                <SelectItem value="MANTENIMIENTO">Mantenimiento</SelectItem>
                <SelectItem value="SUCIA">Sucia / Limpieza</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="mt-4">
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
              disabled={createRoomMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs px-6 shadow-lg shadow-blue-600/15"
            >
              {createRoomMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Guardar Habitación"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
