"use client";

import { useState } from "react";
import { Brush, CheckCheck } from "lucide-react";
import { RegistroLimpieza } from "@/core/room/interfaces";
import { EditLimpiezaDialog } from "@/presentation/dashboard/admin/rooms/edit-limpieza-dialog";

interface LimpiezaCardSectionProps {
    limpiezas: RegistroLimpieza[];
}

export function LimpiezaCardSection({ limpiezas }: LimpiezaCardSectionProps) {
    const [selectedLimpieza, setSelectedLimpieza] = useState<RegistroLimpieza | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const activas = limpiezas.filter((l) => l.estado === "EN_PROGRESO");
    const completadas = limpiezas.filter((l) => l.estado !== "EN_PROGRESO");

    const handleRowClick = (limpieza: RegistroLimpieza) => {
        setSelectedLimpieza(limpieza);
        setIsDialogOpen(true);
    };

    return (
        <>
            <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col gap-4 min-h-[220px]">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-extrabold text-dark-primary">
                            Asignaciones de Limpieza
                        </h3>
                        <p className="text-[11px] font-semibold text-dark-secondary mt-0.5">
                            {activas.length} en progreso · {completadas.length} completadas
                        </p>
                    </div>
                    <div className="h-8 w-8 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center">
                        <Brush className="h-4 w-4" />
                    </div>
                </div>

                {/* Lista */}
                <div className="flex flex-col gap-2 overflow-y-auto max-h-[260px] pr-0.5">
                    {limpiezas.length === 0 ? (
                        <p className="text-xs text-dark-secondary text-center py-6">
                            No hay registros de limpieza activos.
                        </p>
                    ) : (
                        <>
                            {activas.map((limpieza) => (
                                <LimpiezaRow
                                    key={limpieza.id}
                                    limpieza={limpieza}
                                    onClick={() => handleRowClick(limpieza)}
                                />
                            ))}

                            {activas.length > 0 && completadas.length > 0 && (
                                <div className="flex items-center gap-2 py-1">
                                    <div className="h-px flex-1 bg-zinc-100" />
                                    <span className="text-[10px] font-bold text-dark-secondary/40 uppercase tracking-wider">
                                        Completadas
                                    </span>
                                    <div className="h-px flex-1 bg-zinc-100" />
                                </div>
                            )}

                            {completadas.map((limpieza) => (
                                <LimpiezaRow
                                    key={limpieza.id}
                                    limpieza={limpieza}
                                    onClick={() => handleRowClick(limpieza)}
                                />
                            ))}
                        </>
                    )}
                </div>
            </div>

            <EditLimpiezaDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                limpieza={selectedLimpieza}
            />
        </>
    );
}


interface LimpiezaRowProps {
    limpieza: RegistroLimpieza;
    onClick: () => void;
}

function LimpiezaRow({ limpieza, onClick }: LimpiezaRowProps) {
    const isCompleted =
        limpieza.estado === "COMPLETADO" || limpieza.estado === "INSPECCIONADO";

    const initials =
        limpieza.personal_limpieza_details?.full_name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() ?? "??";

    return (
        <div
            onClick={onClick}
            className={`rounded-xl border flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-150 group ${isCompleted
                ? "border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50/60"
                : "border-zinc-100 bg-white hover:border-brand-blue/20 hover:bg-blue-50/20"
                }`}
        >
            <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${isCompleted
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-blue-50 text-brand-blue group-hover:bg-blue-100"
                    }`}>
                    {isCompleted ? <CheckCheck className="h-4 w-4" /> : initials}
                </div>

                <div className="flex flex-col">
                    <span className="text-xs font-bold text-dark-primary">
                        {limpieza.personal_limpieza_details?.full_name ?? "Sin asignar"}
                    </span>
                    <span className="text-[10px] text-dark-secondary/70 font-semibold">
                        Hab. {limpieza.habitacion_numero}
                        {limpieza.fecha_inicio && (
                            <span className="ml-1 text-dark-secondary/40">
                                ·{" "}
                                {new Date(limpieza.fecha_inicio).toLocaleTimeString("es-PE", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        )}
                    </span>
                </div>
            </div>

            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border ${limpieza.estado === "EN_PROGRESO"
                ? "bg-blue-50 text-brand-blue border-blue-100"
                : limpieza.estado === "COMPLETADO"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : "bg-zinc-50 text-zinc-500 border-zinc-100"
                }`}>
                {limpieza.estado_display}
            </span>
        </div>
    );
}