"use client";

import { useState } from "react";
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
  AlertTriangle,
  BedDouble,
  Building2,
} from "lucide-react";
import { IncidenciaPrioridad } from "@/core/incidencia/interfaces";
import { useCreateIncidenciaMutation } from "@/modules/incidencia/domain/hooks/useIncidenciaMutations";
import { useGetPersonalMantenimientoQuery } from "@/modules/incidencia/domain/hooks/useIncidenciaQueries";
import { useGetRoomsQuery } from "@/modules/room/domain/hooks/useRoomQueries";
import { useGetCommonAreasQuery } from "@/modules/common-area/domain/hooks/useCommonAreaQueries";
import { cn } from "@/lib/utils";

type UbicacionTipo = "habitacion" | "area_comun";

interface CreateIncidenciaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateIncidenciaDialog({
  open,
  onOpenChange,
}: CreateIncidenciaDialogProps) {
  const { data: personal = [] } = useGetPersonalMantenimientoQuery();
  const { data: rooms = [] } = useGetRoomsQuery();
  const { data: areas = [] } = useGetCommonAreasQuery();
  const createMutation = useCreateIncidenciaMutation();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [prioridad, setPrioridad] = useState<IncidenciaPrioridad>("MEDIA");
  const [personalId, setPersonalId] = useState("");
  const [ubicacionTipo, setUbicacionTipo] = useState<UbicacionTipo>("habitacion");
  const [habitacionId, setHabitacionId] = useState("");
  const [areaComunId, setAreaComunId] = useState("");

  const resetForm = () => {
    setTitulo("");
    setDescripcion("");
    setPrioridad("MEDIA");
    setPersonalId("");
    setUbicacionTipo("habitacion");
    setHabitacionId("");
    setAreaComunId("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    const hasHabitacion = ubicacionTipo === "habitacion" && habitacionId;
    const hasArea = ubicacionTipo === "area_comun" && areaComunId;

    if (!hasHabitacion && !hasArea) {
      toast.error("Ubicación requerida", {
        description:
          ubicacionTipo === "habitacion"
            ? "Selecciona una habitación."
            : "Selecciona un área común.",
      });
      return;
    }

    createMutation.mutate(
      {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        ...(hasHabitacion ? { habitacion: Number(habitacionId) } : {}),
        ...(hasArea ? { area_comun: Number(areaComunId) } : {}),
        prioridad,
        asignado_a:
          personalId && personalId !== "none" ? Number(personalId) : null,
      },
      {
        onSuccess: () => {
          toast.success("Incidencia registrada", {
            description: "El reporte de mantenimiento fue creado correctamente.",
          });
          resetForm();
          onOpenChange(false);
        },
        onError: (error: Error) => {
          toast.error("Error al registrar", {
            description: error.message || "Ocurrió un problema en el servidor.",
          });
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) resetForm();
      }}
    >
      <DialogContent className="sm:max-w-md bg-white rounded-3xl border border-zinc-100 shadow-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
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
                Nueva Incidencia
              </DialogTitle>
              <DialogDescription className="text-white/70 text-[10px] uppercase font-black tracking-widest mt-0.5">
                Portal de Mantenimiento
              </DialogDescription>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-bold text-dark-primary flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
              Título
              <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Ej: Fuga de agua, Aire acondicionado roto..."
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="h-10 rounded-xl border-zinc-200 text-xs"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs font-bold text-dark-primary">Ubicación</Label>
            <div className="flex gap-2 p-1 bg-zinc-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setUbicacionTipo("habitacion");
                  setHabitacionId("");
                  setAreaComunId("");
                }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-bold transition-all",
                  ubicacionTipo === "habitacion"
                    ? "bg-white text-red-600 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700",
                )}
              >
                <BedDouble className="h-3.5 w-3.5" />
                Habitación
              </button>
              <button
                type="button"
                onClick={() => {
                  setUbicacionTipo("area_comun");
                  setHabitacionId("");
                  setAreaComunId("");
                }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-bold transition-all",
                  ubicacionTipo === "area_comun"
                    ? "bg-white text-red-600 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700",
                )}
              >
                <Building2 className="h-3.5 w-3.5" />
                Área común
              </button>
            </div>
            {ubicacionTipo === "habitacion" ? (
              <Select value={habitacionId} onValueChange={setHabitacionId}>
                <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200">
                  <SelectValue placeholder="Seleccionar habitación..." />
                </SelectTrigger>
                <SelectContent>
                  {rooms.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      No hay habitaciones
                    </SelectItem>
                  ) : (
                    rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id.toString()}>
                        Hab. {room.numero} — {room.tipo_display || room.tipo}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            ) : (
              <Select value={areaComunId} onValueChange={setAreaComunId}>
                <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200">
                  <SelectValue placeholder="Seleccionar área común..." />
                </SelectTrigger>
                <SelectContent>
                  {areas.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      No hay áreas comunes
                    </SelectItem>
                  ) : (
                    areas.map((area) => (
                      <SelectItem key={area.id} value={area.id.toString()}>
                        {area.nombre}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-dark-primary">Prioridad</Label>
              <Select
                value={prioridad}
                onValueChange={(v) => setPrioridad(v as IncidenciaPrioridad)}
              >
                <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALTA">
                    <span className="text-red-600 font-bold">Alta</span>
                  </SelectItem>
                  <SelectItem value="MEDIA">
                    <span className="text-amber-600 font-bold">Media</span>
                  </SelectItem>
                  <SelectItem value="BAJA">
                    <span className="text-zinc-500 font-bold">Baja</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                  {personal.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      {p.firstName && p.lastName
                        ? `${p.firstName} ${p.lastName}`
                        : p.email || p.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-bold text-dark-primary">Descripción</Label>
            <Textarea
              placeholder="Describe el problema con detalle..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="rounded-xl border-zinc-200 text-xs resize-none h-20"
            />
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
