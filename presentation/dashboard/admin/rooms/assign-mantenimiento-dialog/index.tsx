"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Settings2,
  User,
  Loader2,
  BedDouble,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { Prioridad, Room } from "@/core/room/interfaces";
import { useSessionContext } from "@/context/session-context";
import { useGetPersonalMantenimientoQuery } from "@/modules/room/domain/hooks/useIncidenciaQueries";
import { useCreateIncidenciaMutation } from "@/modules/room/domain/hooks/useHabitacionesIncidenciaMutations";

interface AssignMantenimientoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  room: Room | null;
}

export function AssignMantenimientoDialog({
  isOpen,
  onOpenChange,
  room,
}: AssignMantenimientoDialogProps) {
  const { data: personal = [] } = useGetPersonalMantenimientoQuery();
  const createMutation = useCreateIncidenciaMutation();

  const { session } = useSessionContext();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [personalId, setPersonalId] = useState<string>("");
  const [prioridad, setPrioridad] = useState<Prioridad>("MEDIA");

  const resetForm = () => {
    setTitulo("");
    setDescripcion("");
    setPersonalId("");
    setPrioridad("MEDIA");
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!room || !titulo.trim()) return;

    createMutation.mutate(
      {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        habitacion: room.id,
        asignado_a: personalId ? Number(personalId) : null,
        prioridad,
        reportado_por: Number(session?.user?.id),
      },
      {
        onSuccess: () => {
          toast.success("Incidencia Registrada", {
            description: `Se creó el reporte de mantenimiento para la Hab. ${room.numero}.`,
          });
          resetForm();
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error("Error al registrar", {
            description: error.message || "Ocurrió un problema en el servidor.",
          });
        },
      },
    );
  };

  if (!room) return null;

  const prioridadConfig = {
    ALTA: { label: "Alta", color: "text-red-600" },
    MEDIA: { label: "Media", color: "text-amber-600" },
    BAJA: { label: "Baja", color: "text-zinc-500" },
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) resetForm();
      }}
    >
      <DialogContent className="sm:max-w-sm bg-white rounded-3xl border border-zinc-100 shadow-2xl p-0 overflow-hidden">
        {/* Header rojo — diferente al naranja de limpieza */}
        <div className="bg-gradient-to-br from-red-600 to-rose-700 p-6 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-4 opacity-10">
            <Settings2 className="h-32 w-32" />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-white/15 backdrop-blur-md p-2.5 rounded-2xl border border-white/20">
              <Settings2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-extrabold tracking-tight">
                Registrar Incidencia
              </DialogTitle>
              <DialogDescription className="text-white/70 text-[10px] uppercase font-black tracking-widest mt-0.5">
                Habitación {room.numero} · Mantenimiento
              </DialogDescription>
            </div>
          </div>

          {/* Info de la habitación */}
          <div className="mt-4 bg-white/10 rounded-2xl p-3 flex items-center gap-3 border border-white/15 relative z-10">
            <BedDouble className="h-4 w-4 text-white/80 shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">
                Hab. {room.numero} — {room.tipo_display || room.tipo}
              </span>
              <span className="text-[10px] text-white/60 font-semibold mt-0.5">
                Estado actual: {room.estado}
              </span>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {/* Título */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-bold text-dark-primary flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
              Título de la Incidencia
              <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Ej: Fuga de agua en baño, Aire acondicionado roto..."
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="h-10 rounded-xl border-zinc-200 text-xs"
              required
            />
          </div>

          {/* Prioridad y Personal en fila */}
          <div className="grid grid-cols-2 gap-3">
            {/* Prioridad */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-dark-primary">
                Prioridad
              </Label>
              <Select
                value={prioridad}
                onValueChange={(v) => setPrioridad(v as Prioridad)}
              >
                <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALTA">
                    <span className="text-red-600 font-bold">🔴 Alta</span>
                  </SelectItem>
                  <SelectItem value="MEDIA">
                    <span className="text-amber-600 font-bold">🟡 Media</span>
                  </SelectItem>
                  <SelectItem value="BAJA">
                    <span className="text-zinc-500 font-bold">⚪ Baja</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Personal */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-dark-primary flex items-center gap-1">
                <User className="h-3 w-3 text-red-500" />
                Personal
              </Label>
              <Select value={personalId} onValueChange={setPersonalId}>
                <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200">
                  <SelectValue placeholder="Asignar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin asignar</SelectItem>
                  {personal.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      No hay personal
                    </SelectItem>
                  ) : (
                    personal.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.firstName && p.lastName
                          ? `${p.firstName} ${p.lastName}`
                          : p.email || p.username}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-bold text-dark-primary">
              Descripción
            </Label>
            <Textarea
              placeholder="Describe el problema con detalle..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="rounded-xl border-zinc-200 text-xs resize-none h-20"
            />
            <p className="text-[10px] text-dark-secondary/60 font-semibold">
              Opcional — puedes asignar el personal después.
            </p>
          </div>

          <DialogFooter className="mt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-xs font-bold rounded-xl border-zinc-200"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || !titulo.trim()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs px-6 shadow-md shadow-red-600/20"
            >
              {createMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Registrar Incidencia"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
