"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  CheckCheck,
  BedDouble,
  Building2,
  Trash2,
} from "lucide-react";
import {
  Incidencia,
  IncidenciaEstado,
  IncidenciaPrioridad,
} from "@/core/incidencia/interfaces";
import { useGetPersonalMantenimientoQuery } from "@/modules/incidencia/domain/hooks/useIncidenciaQueries";
import {
  useUpdateIncidenciaMutation,
  useDeleteIncidenciaMutation,
} from "@/modules/incidencia/domain/hooks/useIncidenciaMutations";
import { useGetRoomsQuery } from "@/modules/room/domain/hooks/useRoomQueries";
import { useGetCommonAreasQuery } from "@/modules/common-area/domain/hooks/useCommonAreaQueries";
import { cn } from "@/lib/utils";

type UbicacionTipo = "habitacion" | "area_comun";

interface UpdateIncidenciaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incidencia: Incidencia | null;
}

export function UpdateIncidenciaDialog({
  open,
  onOpenChange,
  incidencia,
}: UpdateIncidenciaDialogProps) {
  const { data: personal = [] } = useGetPersonalMantenimientoQuery();
  const { data: rooms = [] } = useGetRoomsQuery();
  const { data: areas = [] } = useGetCommonAreasQuery();
  const updateMutation = useUpdateIncidenciaMutation();
  const deleteMutation = useDeleteIncidenciaMutation();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [prioridad, setPrioridad] = useState<IncidenciaPrioridad>("MEDIA");
  const [estado, setEstado] = useState<IncidenciaEstado>("PENDIENTE");
  const [personalId, setPersonalId] = useState("");
  const [ubicacionTipo, setUbicacionTipo] = useState<UbicacionTipo>("habitacion");
  const [habitacionId, setHabitacionId] = useState("");
  const [areaComunId, setAreaComunId] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!incidencia) return;
    setTitulo(incidencia.titulo);
    setDescripcion(incidencia.descripcion || "");
    setPrioridad(incidencia.prioridad);
    setEstado(incidencia.estado);
    setPersonalId(incidencia.asignado_a_details?.id?.toString() ?? "none");
    if (incidencia.habitacion) {
      setUbicacionTipo("habitacion");
      setHabitacionId(incidencia.habitacion.toString());
      setAreaComunId("");
    } else if (incidencia.area_comun) {
      setUbicacionTipo("area_comun");
      setAreaComunId(incidencia.area_comun.toString());
      setHabitacionId("");
    }
    setConfirmDelete(false);
  }, [incidencia]);

  if (!incidencia) return null;

  const isResolved =
    incidencia.estado === "RESUELTO" || incidencia.estado === "CANCELADO";
  const isPending = updateMutation.isPending || deleteMutation.isPending;

  const ubicacionLabel = incidencia.habitacion_numero
    ? `Habitación ${incidencia.habitacion_numero}`
    : incidencia.area_comun_nombre
      ? `Área ${incidencia.area_comun_nombre}`
      : "Sin ubicación";

  const prioridadBadge = {
    ALTA: "bg-red-100 text-red-600 border-red-200",
    MEDIA: "bg-amber-50 text-amber-600 border-amber-200",
    BAJA: "bg-zinc-100 text-zinc-500 border-zinc-200",
  }[incidencia.prioridad];

  const buildPayload = () => {
    const hasHabitacion = ubicacionTipo === "habitacion" && habitacionId;
    const hasArea = ubicacionTipo === "area_comun" && areaComunId;

    if (!hasHabitacion && !hasArea) {
      toast.error("Ubicación requerida", {
        description: "Selecciona una habitación o un área común.",
      });
      return null;
    }

    return {
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      prioridad,
      estado,
      habitacion: hasHabitacion ? Number(habitacionId) : null,
      area_comun: hasArea ? Number(areaComunId) : null,
      asignado_a:
        personalId && personalId !== "none" ? Number(personalId) : null,
    };
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const data = buildPayload();
    if (!data) return;

    updateMutation.mutate(
      { id: incidencia.id, data },
      {
        onSuccess: () => {
          toast.success("Incidencia actualizada");
          onOpenChange(false);
        },
        onError: () => toast.error("Error al actualizar la incidencia."),
      },
    );
  };

  const handleResolve = () => {
    updateMutation.mutate(
      { id: incidencia.id, data: { estado: "RESUELTO" } },
      {
        onSuccess: () => {
          toast.success("Mantenimiento resuelto", {
            description: incidencia.habitacion_numero
              ? `Hab. ${incidencia.habitacion_numero} marcada como disponible.`
              : "La incidencia fue marcada como resuelta.",
          });
          onOpenChange(false);
        },
        onError: () => toast.error("Error al resolver la incidencia."),
      },
    );
  };

  const handleDelete = () => {
    deleteMutation.mutate(incidencia.id, {
      onSuccess: () => {
        toast.success("Incidencia eliminada");
        onOpenChange(false);
        setConfirmDelete(false);
      },
      onError: () => toast.error("Error al eliminar la incidencia."),
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setConfirmDelete(false);
      }}
    >
      <DialogContent className="sm:max-w-md bg-white rounded-3xl border border-zinc-100 shadow-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-4 opacity-10">
            <Settings2 className="h-32 w-32" />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/15">
              <Settings2 className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-base font-extrabold tracking-tight truncate">
                {incidencia.titulo}
              </DialogTitle>
              <DialogDescription className="text-white/60 text-[10px] uppercase font-black tracking-widest mt-0.5">
                {ubicacionLabel} · Mantenimiento
              </DialogDescription>
            </div>
          </div>
          <div className="mt-4 bg-white/8 rounded-2xl p-3 flex items-center justify-between border border-white/10 relative z-10">
            <div className="flex items-center gap-3">
              {incidencia.habitacion ? (
                <BedDouble className="h-4 w-4 text-white/60 shrink-0" />
              ) : (
                <Building2 className="h-4 w-4 text-white/60 shrink-0" />
              )}
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">
                  {incidencia.asignado_a_details?.full_name ?? "Sin asignar"}
                </span>
                <span className="text-[10px] text-white/50 font-semibold mt-0.5">
                  {incidencia.estado_display}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border ${prioridadBadge}`}
              >
                {incidencia.prioridad_display}
              </span>
              {isResolved && (
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-emerald-400/20 text-emerald-300 border border-emerald-400/20">
                  Resuelto
                </span>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-bold text-dark-primary">Título</Label>
            <Input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              disabled={isResolved}
              className="h-10 rounded-xl border-zinc-200 text-xs disabled:opacity-50"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-bold text-dark-primary">Descripción</Label>
            <Textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={isResolved}
              className="rounded-xl border-zinc-200 text-xs resize-none h-20 disabled:opacity-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-dark-primary">Prioridad</Label>
              <Select
                value={prioridad}
                onValueChange={(v) => setPrioridad(v as IncidenciaPrioridad)}
                disabled={isResolved}
              >
                <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 disabled:opacity-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALTA">Alta</SelectItem>
                  <SelectItem value="MEDIA">Media</SelectItem>
                  <SelectItem value="BAJA">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-dark-primary">Estado</Label>
              <Select
                value={estado}
                onValueChange={(v) => setEstado(v as IncidenciaEstado)}
                disabled={isResolved}
              >
                <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 disabled:opacity-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                  <SelectItem value="EN_PROGRESO">En progreso</SelectItem>
                  <SelectItem value="RESUELTO">Resuelto</SelectItem>
                  <SelectItem value="CANCELADO">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs font-bold text-dark-primary">Ubicación</Label>
            <div className="flex gap-2 p-1 bg-zinc-100 rounded-xl">
              <button
                type="button"
                disabled={isResolved}
                onClick={() => {
                  setUbicacionTipo("habitacion");
                  setAreaComunId("");
                }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-bold transition-all disabled:opacity-50",
                  ubicacionTipo === "habitacion"
                    ? "bg-white text-zinc-800 shadow-sm"
                    : "text-zinc-500",
                )}
              >
                <BedDouble className="h-3.5 w-3.5" />
                Habitación
              </button>
              <button
                type="button"
                disabled={isResolved}
                onClick={() => {
                  setUbicacionTipo("area_comun");
                  setHabitacionId("");
                }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-bold transition-all disabled:opacity-50",
                  ubicacionTipo === "area_comun"
                    ? "bg-white text-zinc-800 shadow-sm"
                    : "text-zinc-500",
                )}
              >
                <Building2 className="h-3.5 w-3.5" />
                Área común
              </button>
            </div>
            {ubicacionTipo === "habitacion" ? (
              <Select
                value={habitacionId}
                onValueChange={setHabitacionId}
                disabled={isResolved}
              >
                <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 disabled:opacity-50">
                  <SelectValue placeholder="Habitación..." />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id.toString()}>
                      Hab. {room.numero}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Select
                value={areaComunId}
                onValueChange={setAreaComunId}
                disabled={isResolved}
              >
                <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 disabled:opacity-50">
                  <SelectValue placeholder="Área común..." />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area.id} value={area.id.toString()}>
                      {area.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-bold text-dark-primary flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-zinc-500" />
              Personal asignado
            </Label>
            <Select
              value={personalId}
              onValueChange={setPersonalId}
              disabled={isResolved}
            >
              <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 disabled:opacity-50">
                <SelectValue placeholder="Seleccionar técnico..." />
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

          {!isResolved && (
            <>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-zinc-100" />
                <span className="text-[10px] font-bold text-dark-secondary/40 uppercase tracking-wider">
                  o
                </span>
                <div className="h-px flex-1 bg-zinc-100" />
              </div>
              <button
                type="button"
                onClick={handleResolve}
                disabled={isPending}
                className="w-full h-11 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition-colors disabled:opacity-50"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CheckCheck className="h-4 w-4" />
                    Marcar como Resuelto
                  </>
                )}
              </button>
            </>
          )}

          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              disabled={isPending}
              className="w-full h-9 flex items-center justify-center gap-2 text-red-500 hover:text-red-600 text-[11px] font-extrabold rounded-xl border border-red-100 hover:bg-red-50 transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Eliminar incidencia
            </button>
          ) : (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 flex flex-col gap-2">
              <p className="text-xs font-bold text-red-600 text-center">
                ¿Eliminar esta incidencia?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 h-8 text-[11px] font-bold rounded-lg border border-zinc-200"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="flex-1 h-8 text-[11px] font-extrabold rounded-lg bg-red-600 text-white"
                >
                  Eliminar
                </button>
              </div>
            </div>
          )}

          <DialogFooter className="mt-1 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-xs font-bold rounded-xl border-zinc-200"
            >
              Cerrar
            </Button>
            {!isResolved && (
              <Button
                type="submit"
                disabled={isPending || !titulo.trim()}
                className="bg-zinc-800 hover:bg-zinc-900 text-white font-bold rounded-xl text-xs px-6"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Guardar cambios"
                )}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
