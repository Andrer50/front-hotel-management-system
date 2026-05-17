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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Brush, User, Loader2, BedDouble } from "lucide-react";
import { useState } from "react";
import { Room } from "@/core/room/interfaces";
import { useGetPersonalLimpiezaQuery } from "@/modules/room/domain/hooks/useLimpiezaQueries";
import { useCreateLimpiezaMutation } from "@/modules/room/domain/hooks/useLimpiezaMutations";

interface AssignLimpiezaDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    room: Room | null;
}

export function AssignLimpiezaDialog({
    isOpen,
    onOpenChange,
    room,
}: AssignLimpiezaDialogProps) {
    const { data: personal = [] } = useGetPersonalLimpiezaQuery();
    const createLimpiezaMutation = useCreateLimpiezaMutation();

    const [personalId, setPersonalId] = useState<string>("");
    const [observaciones, setObservaciones] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!room) return;

        createLimpiezaMutation.mutate(
            {
                habitacion: room.id,
                personal_limpieza: personalId ? Number(personalId) : null,
                observaciones: observaciones || undefined,
            },
            {
                onSuccess: () => {
                    toast.success("Limpieza Asignada", {
                        description: `Se registró la limpieza para la habitación ${room.numero}.`,
                    });
                    setPersonalId("");
                    setObservaciones("");
                    onOpenChange(false);
                },
                onError: (error) => {
                    toast.error("Error al asignar", {
                        description: error.message || "Ocurrió un problema en el servidor.",
                    });
                },
            },
        );
    };

    if (!room) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm bg-white rounded-3xl border border-zinc-100 shadow-2xl p-0 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-6 text-white relative overflow-hidden">
                    <div className="absolute right-0 top-0 translate-x-8 -translate-y-4 opacity-10">
                        <Brush className="h-32 w-32" />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="bg-white/15 backdrop-blur-md p-2.5 rounded-2xl border border-white/20">
                            <Brush className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-extrabold tracking-tight">
                                Asignar Limpieza
                            </DialogTitle>
                            <DialogDescription className="text-white/70 text-[10px] uppercase font-black tracking-widest mt-0.5">
                                Habitación {room.numero}
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
                    {/* Selector de Personal */}
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs font-bold text-dark-primary flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-amber-500" />
                            Personal Asignado
                        </Label>
                        <Select value={personalId} onValueChange={setPersonalId}>
                            <SelectTrigger className="h-10 text-xs rounded-xl border-zinc-200">
                                <SelectValue placeholder="Seleccionar camarera/o..." />
                            </SelectTrigger>
                            <SelectContent>
                                {personal.length === 0 ? (
                                    <SelectItem value="none" disabled>
                                        No hay personal disponible
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
                        <p className="text-[10px] text-dark-secondary/60 font-semibold">
                            Opcional — puedes asignar el personal después.
                        </p>
                    </div>

                    {/* Observaciones */}
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs font-bold text-dark-primary">
                            Observaciones
                        </Label>
                        <Textarea
                            placeholder="Ej: Cambio de sábanas completo, revisar baño..."
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
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
                            disabled={createLimpiezaMutation.isPending}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs px-6"
                        >
                            {createLimpiezaMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Registrar Limpieza"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}