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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Settings2, User, Loader2, CheckCheck, BedDouble, Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Incidencia } from "@/core/room/interfaces";
import { useGetPersonalMantenimientoQuery } from "@/modules/room/domain/hooks/useIncidenciaQueries";
import { useUpdateIncidenciaMutation, useDeleteIncidenciaMutation } from "@/modules/room/domain/hooks/useHabitacionesIncidenciaMutations";

interface EditIncidenciaDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    incidencia: Incidencia | null;
}

export function EditIncidenciaDialog({
    isOpen,
    onOpenChange,
    incidencia,
}: EditIncidenciaDialogProps) {
    const { data: personal = [] } = useGetPersonalMantenimientoQuery();
    const updateMutation = useUpdateIncidenciaMutation();
    const deleteMutation = useDeleteIncidenciaMutation();

    const [personalId, setPersonalId] = useState<string>(
        incidencia?.asignado_a_details?.id?.toString() ?? ""
    );
    const [confirmDelete, setConfirmDelete] = useState(false);

    const isResolved =
        incidencia?.estado === "RESUELTO" || incidencia?.estado === "CANCELADO";
    const isPending = updateMutation.isPending || deleteMutation.isPending;

    const handleReassign = (e: React.FormEvent) => {
        e.preventDefault();
        if (!incidencia) return;

        updateMutation.mutate(
            {
                id: incidencia.id,
                data: {
                    asignado_a: personalId && personalId !== "none"
                        ? Number(personalId)
                        : null,
                },
            },
            {
                onSuccess: () => {
                    toast.success("Personal reasignado", {
                        description: `Incidencia de Hab. ${incidencia.habitacion_numero} actualizada.`,
                    });
                    onOpenChange(false);
                },
                onError: () => {
                    toast.error("Error al reasignar el personal.");
                },
            }
        );
    };

    const handleResolve = () => {
        if (!incidencia) return;
        updateMutation.mutate(
            { id: incidencia.id, data: { estado: "RESUELTO" } },
            {
                onSuccess: () => {
                    toast.success("Mantenimiento resuelto", {
                        description: `Hab. ${incidencia.habitacion_numero} marcada como disponible.`,
                    });
                    onOpenChange(false);
                },
                onError: () => {
                    toast.error("Error al resolver la incidencia.");
                },
            }
        );
    };

    const handleDelete = () => {
        if (!incidencia) return;
        deleteMutation.mutate(incidencia.id, {
            onSuccess: () => {
                toast.success("Incidencia eliminada", {
                    description: `Se eliminó el reporte de la Hab. ${incidencia.habitacion_numero}.`,
                });
                onOpenChange(false);
                setConfirmDelete(false);
            },
            onError: () => {
                toast.error("Error al eliminar la incidencia.");
            },
        });
    };

    if (!incidencia) return null;

    const prioridadBadge = {
        ALTA: "bg-red-100 text-red-600 border-red-200",
        MEDIA: "bg-amber-50 text-amber-600 border-amber-200",
        BAJA: "bg-zinc-100 text-zinc-500 border-zinc-200",
    }[incidencia.prioridad] ?? "bg-zinc-100 text-zinc-500 border-zinc-200";

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                onOpenChange(open);
                if (!open) setConfirmDelete(false);
            }}
        >
            <DialogContent className="sm:max-w-sm bg-white rounded-3xl border border-zinc-100 shadow-2xl p-0 overflow-hidden">
                {/* Header */}
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
                                {incidencia.habitacion_numero
                                    ? `Habitación ${incidencia.habitacion_numero}`
                                    : "Sin habitación"} · Mantenimiento
                            </DialogDescription>
                        </div>
                    </div>

                    {/* Info de la incidencia */}
                    <div className="mt-4 bg-white/8 rounded-2xl p-3 flex items-center justify-between border border-white/10 relative z-10">
                        <div className="flex items-center gap-3">
                            <BedDouble className="h-4 w-4 text-white/60 shrink-0" />
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
                            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border ${prioridadBadge}`}>
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

                {/* Formulario */}
                <form onSubmit={handleReassign} className="p-6 flex flex-col gap-4">

                    {/* Descripción (solo lectura) */}
                    {incidencia.descripcion && (
                        <div className="bg-zinc-50 rounded-xl p-3 border border-zinc-100">
                            <p className="text-[10px] font-extrabold text-dark-secondary/60 uppercase tracking-wider mb-1">
                                Descripción
                            </p>
                            <p className="text-xs text-dark-primary font-semibold leading-relaxed">
                                {incidencia.descripcion}
                            </p>
                        </div>
                    )}
                    {/* Reasignar personal */}
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs font-bold text-dark-primary flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-zinc-500" />
                            Reasignar Personal
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
                        {isResolved && (
                            <p className="text-[10px] text-dark-secondary/50 font-semibold">
                                No se puede reasignar — la incidencia ya está resuelta.
                            </p>
                        )}
                    </div>

                    {/* Botón resolver */}
                    {!isResolved && (
                        <>
                            <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-zinc-100" />
                                <span className="text-[10px] font-bold text-dark-secondary/40 uppercase tracking-wider">o</span>
                                <div className="h-px flex-1 bg-zinc-100" />
                            </div>
                            <button
                                type="button"
                                onClick={handleResolve}
                                disabled={isPending}
                                className="w-full h-11 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-600/20"
                            >
                                {updateMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        <CheckCheck className="h-4 w-4" />
                                        Marcar como Resuelto → Hab. LISTA
                                    </>
                                )}
                            </button>
                        </>
                    )}

                    {/* Eliminar — confirmación en dos pasos */}
                    {!confirmDelete ? (
                        <button
                            type="button"
                            onClick={() => setConfirmDelete(true)}
                            disabled={isPending}
                            className="w-full h-9 flex items-center justify-center gap-2 text-red-500 hover:text-red-600 text-[11px] font-extrabold rounded-xl border border-red-100 hover:border-red-200 hover:bg-red-50 transition-all disabled:opacity-40"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Eliminar incidencia
                        </button>
                    ) : (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 flex flex-col gap-2">
                            <p className="text-xs font-bold text-red-600 text-center">
                                ¿Eliminar esta incidencia?
                            </p>
                            <p className="text-[10px] text-red-400 font-semibold text-center">
                                Esta acción no se puede deshacer.
                            </p>
                            <div className="flex gap-2 mt-1">
                                <button
                                    type="button"
                                    onClick={() => setConfirmDelete(false)}
                                    className="flex-1 h-8 text-[11px] font-bold rounded-lg border border-zinc-200 text-dark-secondary hover:bg-zinc-50 transition-colors"
                                >
                                    No, volver
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={deleteMutation.isPending}
                                    className="flex-1 h-8 text-[11px] font-extrabold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
                                >
                                    {deleteMutation.isPending ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin mx-auto" />
                                    ) : (
                                        "Sí, eliminar"
                                    )}
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
                                disabled={isPending || !personalId || personalId === "none"}
                                className="bg-zinc-800 hover:bg-zinc-900 text-white font-bold rounded-xl text-xs px-6"
                            >
                                {updateMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Guardar Cambios"
                                )}
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}