"use client";

import {
    Dialog, DialogContent, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LogOut, Loader2, BedDouble, User, Calendar } from "lucide-react";
import { useState } from "react";
import { useCheckOutMutation } from "@/modules/reservation/domain/hooks/useReservationMutations";
import { Reservation } from "@/core/reservation/interfaces";

interface CheckOutDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    reservation: Reservation | null;
    onSuccess: () => void;
}

export function CheckOutDialog({ isOpen, onOpenChange, reservation, onSuccess }: CheckOutDialogProps) {
    const checkOutMutation = useCheckOutMutation();
    const [observaciones, setObservaciones] = useState("");

    const handleConfirm = () => {
        if (!reservation) return;

        checkOutMutation.mutate(
            { id: reservation.id, observaciones },
            {
                onSuccess: () => {
                    toast.success("Check-out registrado", {
                        description: `${reservation.huesped_nombre} — Hab. ${reservation.habitacion_numero} marcada para limpieza.`,
                    });
                    setObservaciones("");
                    onOpenChange(false);
                    onSuccess();
                },
                onError: (error) => {
                    toast.error("Error en check-out", {
                        description: error.message || "No se pudo registrar el check-out.",
                    });
                },
            }
        );
    };

    if (!reservation) return null;

    const now = new Date();
    const timeStr = now.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
    const dateStr = now.toLocaleDateString("es-PE", { day: "2-digit", month: "long", year: "numeric" });

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm bg-white rounded-2xl p-0 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-br from-zinc-800 to-zinc-700 p-5 text-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-xl">
                            <LogOut className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-base font-extrabold">Registrar Check-Out</DialogTitle>
                            <DialogDescription className="text-white/80 text-[11px] mt-0.5">
                                {reservation.codigo_reserva}
                            </DialogDescription>
                        </div>
                    </div>
                </div>

                <div className="p-5 flex flex-col gap-4">
                    {/* Resumen */}
                    <div className="bg-zinc-50 rounded-xl p-4 flex flex-col gap-2.5">
                        <div className="flex items-center gap-2 text-xs">
                            <User className="h-3.5 w-3.5 text-zinc-400" />
                            <span className="font-bold text-dark-primary">{reservation.huesped_nombre}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <BedDouble className="h-3.5 w-3.5 text-zinc-400" />
                            <span className="text-dark-secondary">Habitación <strong>{reservation.habitacion_numero}</strong> → marcará como <strong className="text-amber-600">SUCIA</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                            <span className="text-dark-secondary">
                                Timestamp: <strong>{dateStr} — {timeStr}</strong>
                            </span>
                        </div>
                    </div>

                    {/* Observaciones opcionales */}
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-xs font-bold text-dark-primary">
                            Observaciones (opcional)
                        </Label>
                        <Textarea
                            placeholder="Estado de la habitación, incidencias al salir..."
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            className="text-xs rounded-xl resize-none h-20 border-zinc-200"
                        />
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-2 mt-1">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 text-xs rounded-xl border-zinc-200"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={checkOutMutation.isPending}
                            className="flex-1 bg-zinc-800 hover:bg-zinc-900 text-white text-xs font-bold rounded-xl"
                        >
                            {checkOutMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <><LogOut className="h-3.5 w-3.5 mr-1.5" /> Confirmar Check-Out</>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}