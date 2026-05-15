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
  Layers,
  Settings2,
  CheckCircle2,
  AlertTriangle,
  Brush,
  Clock,
} from "lucide-react";
import { useUpdateRoomMutation } from "@/modules/room/domain/hooks/useRoomMutations";
import { useGetPlantasQuery } from "@/modules/room/domain/hooks/usePlantaQueries";
import { Room, RoomEstado, RoomTipo } from "@/core/room/interfaces";

interface UpdateRoomDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  room: Room | null;
}

export function UpdateRoomDialog({
  isOpen,
  onOpenChange,
  room,
}: UpdateRoomDialogProps) {
  const { data: plantas = [] } = useGetPlantasQuery();
  const updateRoomMutation = useUpdateRoomMutation();

  const [numero, setNumero] = useState(room?.numero || "");
  const [plantaId, setPlantaId] = useState<string>(
    room?.planta?.toString() || "",
  );
  const [tipo, setTipo] = useState<RoomTipo>(room?.tipo || "INDIVIDUAL");
  const [capacidad, setCapacidad] = useState(room?.capacidad.toString() || "");
  const [precioBase, setPrecioBase] = useState(room?.precio_base || "");
  const [estado, setEstado] = useState<RoomEstado>(
    room?.estado || "DISPONIBLE",
  );

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!room) return;

    updateRoomMutation.mutate(
      {
        id: room.id,
        numero,
        planta: plantaId ? Number(plantaId) : undefined,
        tipo,
        capacidad: Number(capacidad),
        precio_base: Number(precioBase),
        estado,
      },
      {
        onSuccess: () => {
          toast.success("Habitación Actualizada", {
            description: `Los cambios en la habitación ${numero} se guardaron correctamente.`,
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

  // Función para cambio rápido de estado desde el header
  const handleQuickStatusChange = (newStatus: RoomEstado) => {
    setEstado(newStatus);
    if (room) {
      updateRoomMutation.mutate(
        {
          id: room.id,
          estado: newStatus,
        },
        {
          onSuccess: () => {
            toast.success(`Estado: ${newStatus}`, {
              description: "Estado actualizado rápidamente.",
            });
          },
        },
      );
    }
  };

  if (!room) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white rounded-3xl border border-zinc-100 shadow-2xl p-0 overflow-hidden isolate">
        {/* Cabecera Premium con Selector de Estado Rápido */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-6 opacity-5">
            <Settings2 className="h-40 w-40" />
          </div>

          <div className="flex flex-col gap-5 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/20">
                  <BedDouble className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-extrabold tracking-tight">
                    Habitación {room.numero}
                  </DialogTitle>
                  <DialogDescription className="text-white/60 text-[10px] uppercase font-black tracking-widest mt-0.5">
                    Panel de Gestión Directa
                  </DialogDescription>
                </div>
              </div>
            </div>

            {/* Selector de Estado Rápido (Chips) */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
              {(
                [
                  {
                    id: "DISPONIBLE",
                    label: "LISTA",
                    color: "bg-emerald-500",
                    icon: CheckCircle2,
                  },
                  {
                    id: "OCUPADA",
                    label: "OCUPADA",
                    color: "bg-zinc-500",
                    icon: Clock,
                  },
                  {
                    id: "SUCIA",
                    label: "SUCIA",
                    color: "bg-amber-500",
                    icon: Brush,
                  },
                  {
                    id: "MANTENIMIENTO",
                    label: "MTTO",
                    color: "bg-red-500",
                    icon: AlertTriangle,
                  },
                ] as const
              ).map((statusOpt) => {
                const isActive = estado === statusOpt.id;
                const Icon = statusOpt.icon;
                return (
                  <button
                    key={statusOpt.id}
                    onClick={() => handleQuickStatusChange(statusOpt.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl transition-all duration-300 border ${
                      isActive
                        ? `${statusOpt.color} border-transparent text-white shadow-lg scale-105`
                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`h-3 w-3 ${isActive ? "animate-pulse" : ""}`}
                    />
                    <span className="text-[9px] font-black">
                      {statusOpt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Formulario de Edición Técnica */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="edit-numero"
                className="text-xs font-bold text-dark-primary flex items-center gap-1.5"
              >
                <Hash className="h-3.5 w-3.5 text-blue-600" /> N° Habitación
              </Label>
              <Input
                id="edit-numero"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                className="rounded-xl border-zinc-200 h-10 text-xs"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-dark-primary flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" /> Tipo
              </Label>
              <Select
                value={tipo}
                onValueChange={(val) => setTipo(val as RoomTipo)}
              >
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

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-bold text-dark-primary flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-blue-600" /> Planta / Piso
            </Label>
            <Select value={plantaId} onValueChange={setPlantaId}>
              <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200">
                <SelectValue placeholder="Seleccionar planta" />
              </SelectTrigger>
              <SelectContent>
                {plantas.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    {p.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="edit-cap"
                className="text-xs font-bold text-dark-primary flex items-center gap-1.5"
              >
                <Users className="h-3.5 w-3.5 text-blue-600" /> Capacidad
              </Label>
              <Input
                id="edit-cap"
                type="number"
                value={capacidad}
                onChange={(e) => setCapacidad(e.target.value)}
                className="rounded-xl border-zinc-200 h-10 text-xs"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="edit-precio"
                className="text-xs font-bold text-dark-primary flex items-center gap-1.5"
              >
                <DollarSign className="h-3.5 w-3.5 text-blue-600" /> Precio
                (S/.)
              </Label>
              <Input
                id="edit-precio"
                value={precioBase}
                onChange={(e) => setPrecioBase(e.target.value)}
                className="rounded-xl border-zinc-200 h-10 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-xs font-bold rounded-xl border-zinc-200"
            >
              Cerrar
            </Button>
            <Button
              type="submit"
              disabled={updateRoomMutation.isPending}
              className="bg-zinc-900 hover:bg-black text-white font-bold rounded-xl text-xs px-6"
            >
              {updateRoomMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
