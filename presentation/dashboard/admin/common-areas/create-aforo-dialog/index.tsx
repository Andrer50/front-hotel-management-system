"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useGetGuestSelectDataQuery } from "@/modules/guest/domain/hooks/useGuestQueries";
import { useGetCommonAreasQuery } from "@/modules/common-area/domain/hooks/useCommonAreaQueries";
import { useAforoMutations } from "@/modules/common-area/domain/hooks/useAforoMutations";

interface CreateAforoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const CreateAforoDialog = ({
    open,
    onOpenChange,
}: CreateAforoDialogProps) => {
    const { data: selectData } = useGetGuestSelectDataQuery();
    const guests = selectData?.huespedes || [];
    const { data: areas = [] } = useGetCommonAreasQuery();
    const { createMutation } = useAforoMutations();

    const [huesped, setHuesped] = useState("");
    const [areaComun, setAreaComun] = useState("");
    const [fechaIngreso, setFechaIngreso] = useState("");
    const [fechaSalida, setFechaSalida] = useState("");
    const [notas, setNotas] = useState("");

    const handleSubmit = () => {
        createMutation.mutate(
            {
                area_comun: Number(areaComun),
                huesped: Number(huesped),
                fecha_ingreso_programada: fechaIngreso,
                fecha_salida_programada: fechaSalida,
                notas,
            },
            {
                onSuccess: () => {
                    onOpenChange(false);
                    resetForm();
                },
            }
        );
    };

    const resetForm = () => {
        setHuesped("");
        setAreaComun("");
        setFechaIngreso("");
        setFechaSalida("");
        setNotas("");
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            onOpenChange(val);
            if (!val) resetForm();
        }}>
            <DialogContent className="sm:max-w-[700px] bg-white rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                <DialogHeader className="p-8 pb-4 bg-zinc-900 text-white relative">
                    <DialogTitle className="text-2xl font-bold tracking-tight uppercase">
                        AGENDAR AFORO
                    </DialogTitle>
                    <p className="text-zinc-400 text-xs font-bold mt-1 uppercase tracking-widest">
                        Reserva de espacios comunes para huéspedes
                    </p>
                </DialogHeader>

                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-dark-secondary uppercase tracking-widest ml-1">
                                Huésped
                            </Label>
                            <Select value={huesped} onValueChange={setHuesped}>
                                <SelectTrigger className="h-12 bg-zinc-50 border-none rounded-2xl px-4 focus:ring-2 focus:ring-zinc-900 transition-all font-medium">
                                    <SelectValue placeholder="Seleccionar huésped" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-zinc-100 shadow-xl max-h-[200px]">
                                    {guests.map((g: any) => (
                                        <SelectItem key={g.id} value={g.id.toString()}>
                                            {g.nombre_completo} ({g.documento})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-dark-secondary uppercase tracking-widest ml-1">
                                Área Común
                            </Label>
                            <Select value={areaComun} onValueChange={setAreaComun}>
                                <SelectTrigger className="h-12 bg-zinc-50 border-none rounded-2xl px-4 focus:ring-2 focus:ring-zinc-900 transition-all font-medium">
                                    <SelectValue placeholder="Seleccionar área" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-zinc-100 shadow-xl">
                                    {areas.map((a) => (
                                        <SelectItem key={a.id} value={a.id.toString()}>
                                            {a.nombre} (Aforo: {a.aforo_actual}/{a.capacidad_maxima})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-dark-secondary uppercase tracking-widest ml-1">
                                Fecha/Hora Ingreso
                            </Label>
                            <Input
                                type="datetime-local"
                                value={fechaIngreso}
                                onChange={(e) => setFechaIngreso(e.target.value)}
                                className="h-12 bg-zinc-50 border-none rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-zinc-900 transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-dark-secondary uppercase tracking-widest ml-1">
                                Fecha/Hora Salida
                            </Label>
                            <Input
                                type="datetime-local"
                                value={fechaSalida}
                                onChange={(e) => setFechaSalida(e.target.value)}
                                className="h-12 bg-zinc-50 border-none rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-zinc-900 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-dark-secondary uppercase tracking-widest ml-1">
                            Notas Adicionales (Opcional)
                        </Label>
                        <Textarea
                            placeholder="Detalles de la reserva..."
                            value={notas}
                            onChange={(e) => setNotas(e.target.value)}
                            className="min-h-[100px] bg-zinc-50 border-none rounded-3xl p-4 focus-visible:ring-2 focus-visible:ring-zinc-900 transition-all font-medium resize-none"
                        />
                    </div>

                    <div className="flex gap-4 mt-8">
                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 h-12 rounded-2xl font-bold text-xs text-dark-secondary hover:bg-zinc-100 uppercase tracking-widest cursor-pointer"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={createMutation.isPending || !huesped || !areaComun || !fechaIngreso || !fechaSalida}
                            className="flex-[2] h-12 bg-zinc-900 hover:bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-zinc-900/20 disabled:opacity-50 transition-all cursor-pointer"
                        >
                            {createMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "CREAR RESERVA"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};