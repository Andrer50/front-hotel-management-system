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
import { Brush, User, Loader2, CheckCheck, BedDouble, Trash2 } from "lucide-react";
import { useState } from "react";
import { RegistroLimpieza } from "@/core/room/interfaces";
import { useGetPersonalLimpiezaQuery } from "@/modules/room/domain/hooks/useLimpiezaQueries";
import { useUpdateLimpiezaMutation, useDeleteLimpiezaMutation } from "@/modules/room/domain/hooks/useLimpiezaMutations";
 
interface EditLimpiezaDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    limpieza: RegistroLimpieza | null;
}
 
export function EditLimpiezaDialog({
    isOpen,
    onOpenChange,
    limpieza,
}: EditLimpiezaDialogProps) {
    const { data: personal = [] } = useGetPersonalLimpiezaQuery();
    const updateMutation = useUpdateLimpiezaMutation();
    const deleteMutation = useDeleteLimpiezaMutation();
 
    const [personalId, setPersonalId] = useState<string>(
        limpieza?.personal_limpieza?.toString() ?? ""
    );
    const [confirmDelete, setConfirmDelete] = useState(false);
 
    const handleReassign = (e: React.FormEvent) => {
        e.preventDefault();
        if (!limpieza) return;
 
        updateMutation.mutate(
            {
                id: limpieza.id,
                data: {
                    personal_limpieza: personalId && personalId !== "none"
                        ? Number(personalId)
                        : null,
                },
            },
            {
                onSuccess: () => {
                    toast.success("Personal reasignado", {
                        description: `Se actualizó la asignación de la Hab. ${limpieza.habitacion_numero}.`,
                    });
                    onOpenChange(false);
                },
                onError: () => {
                    toast.error("Error al reasignar el personal.");
                },
            }
        );
    };
 
    const handleComplete = () => {
        if (!limpieza) return;
        updateMutation.mutate(
            { id: limpieza.id, data: { estado: "COMPLETADO" } },
            {
                onSuccess: () => {
                    toast.success("Limpieza completada", {
                        description: `Hab. ${limpieza.habitacion_numero} marcada como disponible.`,
                    });
                    onOpenChange(false);
                },
                onError: () => {
                    toast.error("Error al completar la limpieza.");
                },
            }
        );
    };
 
    const handleDelete = () => {
        if (!limpieza) return;
        deleteMutation.mutate(limpieza.id, {
            onSuccess: () => {
                toast.success("Registro eliminado", {
                    description: `Se canceló la limpieza de la Hab. ${limpieza.habitacion_numero}.`,
                });
                onOpenChange(false);
                setConfirmDelete(false);
            },
            onError: () => {
                toast.error("Error al eliminar el registro.");
            },
        });
    };
 
    if (!limpieza) return null;
 
    const isCompleted = limpieza.estado === "COMPLETADO" || limpieza.estado === "INSPECCIONADO";
    const isPending = updateMutation.isPending || deleteMutation.isPending;
 
    return (
        <Dialog open={isOpen} onOpenChange={(open) => { onOpenChange(open); setConfirmDelete(false); }}>
            <DialogContent className="sm:max-w-sm bg-white rounded-3xl border border-zinc-100 shadow-2xl p-0 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white relative overflow-hidden">
                    <div className="absolute right-0 top-0 translate-x-8 -translate-y-4 opacity-10">
                        <Brush className="h-32 w-32" />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="bg-white/15 backdrop-blur-md p-2.5 rounded-2xl border border-white/20">
                            <Brush className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-extrabold tracking-tight">
                                Gestionar Limpieza
                            </DialogTitle>
                            <DialogDescription className="text-white/70 text-[10px] uppercase font-black tracking-widest mt-0.5">
                                Habitación {limpieza.habitacion_numero}
                            </DialogDescription>
                        </div>
                    </div>
 
                    <div className="mt-4 bg-white/10 rounded-2xl p-3 flex items-center justify-between border border-white/15 relative z-10">
                        <div className="flex items-center gap-3">
                            <BedDouble className="h-4 w-4 text-white/80 shrink-0" />
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-white">
                                    {limpieza.personal_limpieza_details?.full_name ?? "Sin asignar"}
                                </span>
                                <span className="text-[10px] text-white/60 font-semibold mt-0.5">
                                    Hab. {limpieza.habitacion_numero} · {limpieza.estado_display}
                                </span>
                            </div>
                        </div>
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border ${
                            isCompleted
                                ? "bg-emerald-400/20 text-emerald-200 border-emerald-300/20"
                                : "bg-white/15 text-white border-white/20"
                        }`}>
                            {limpieza.estado_display}
                        </span>
                    </div>
                </div>
 
                {/* Formulario */}
                <form onSubmit={handleReassign} className="p-6 flex flex-col gap-4">
 
                    {/* Reasignar personal */}
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs font-bold text-dark-primary flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-brand-blue" />
                            Reasignar Personal
                        </Label>
                        <Select value={personalId} onValueChange={setPersonalId} disabled={isCompleted}>
                            <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200 disabled:opacity-50">
                                <SelectValue placeholder="Seleccionar camarera/o..." />
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
                        {isCompleted && (
                            <p className="text-[10px] text-dark-secondary/50 font-semibold">
                                No se puede reasignar — la limpieza ya está completada.
                            </p>
                        )}
                    </div>
 
                    {/* Botón completar */}
                    {!isCompleted && (
                        <>
                            <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-zinc-100" />
                                <span className="text-[10px] font-bold text-dark-secondary/40 uppercase tracking-wider">o</span>
                                <div className="h-px flex-1 bg-zinc-100" />
                            </div>
                            <button
                                type="button"
                                onClick={handleComplete}
                                disabled={isPending}
                                className="w-full h-11 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-600/20"
                            >
                                {updateMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        <CheckCheck className="h-4 w-4" />
                                        Marcar como Completada → Hab. LISTA
                                    </>
                                )}
                            </button>
                        </>
                    )}
 
                    {/* Zona de eliminar — confirmación en dos pasos */}
                    {!confirmDelete ? (
                        <button
                            type="button"
                            onClick={() => setConfirmDelete(true)}
                            disabled={isPending}
                            className="w-full h-9 flex items-center justify-center gap-2 text-red-500 hover:text-red-600 text-[11px] font-extrabold rounded-xl border border-red-100 hover:border-red-200 hover:bg-red-50 transition-all disabled:opacity-40"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Cancelar y eliminar registro
                        </button>
                    ) : (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 flex flex-col gap-2">
                            <p className="text-xs font-bold text-red-600 text-center">
                                ¿Eliminar este registro de limpieza?
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
                        {!isCompleted && (
                            <Button
                                type="submit"
                                disabled={isPending || !personalId || personalId === "none"}
                                className="bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-xs px-6"
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