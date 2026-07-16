"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RegistroAforo } from "@/core/common-area/interfaces";
import { useAforoMutations } from "@/modules/common-area/domain/hooks/useAforoMutations";
import { Badge } from "@/components/ui/badge";

interface ManageAforoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aforo: RegistroAforo | null;
}

export const ManageAforoDialog = ({
  open,
  onOpenChange,
  aforo,
}: ManageAforoDialogProps) => {
  const { updateMutation, checkInMutation, checkOutMutation } =
    useAforoMutations();

  if (!aforo) return null;

  const handleUpdateStatus = (estado: "CONFIRMADA" | "CANCELADA") => {
    updateMutation.mutate(
      { id: aforo.id, estado },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  const handleCheckIn = () => {
    checkInMutation.mutate(aforo.id, { onSuccess: () => onOpenChange(false) });
  };

  const handleCheckOut = () => {
    checkOutMutation.mutate(aforo.id, { onSuccess: () => onOpenChange(false) });
  };

  const isPending =
    updateMutation.isPending ||
    checkInMutation.isPending ||
    checkOutMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-white rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-8 pb-4 bg-zinc-900 text-white relative">
          <DialogTitle className="text-2xl font-bold tracking-tight uppercase">
            GESTIÓN DE RESERVA
          </DialogTitle>
          <p className="text-zinc-400 text-xs font-bold mt-1 uppercase tracking-widest">
            Acciones operativas
          </p>
        </DialogHeader>

        <div className="p-8 space-y-6">
          <div className="bg-zinc-50 rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Estado
              </span>
              <Badge
                variant="outline"
                className="font-bold text-[10px] uppercase tracking-widest bg-white"
              >
                {aforo.estado_display}
              </Badge>
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Huésped
              </p>
              <p className="font-medium text-zinc-900">
                {aforo.huesped_details.nombre_completo}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Área
              </p>
              <p className="font-medium text-zinc-900">
                {aforo.area_comun_nombre}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Ingreso Programado
              </p>
              <p className="font-medium text-zinc-900">
                {new Date(aforo.fecha_ingreso_programada).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {aforo.estado === "PENDIENTE" && (
              <>
                <Button
                  onClick={() => handleUpdateStatus("CONFIRMADA")}
                  disabled={isPending}
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-emerald-900/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  Confirmar Reserva
                </Button>
                <Button
                  onClick={() => handleUpdateStatus("CANCELADA")}
                  disabled={isPending}
                  variant="outline"
                  className="w-full h-12 rounded-2xl font-bold text-xs text-red-600 border-red-100 hover:bg-red-50 uppercase tracking-widest cursor-pointer"
                >
                  Cancelar Reserva
                </Button>
              </>
            )}

            {aforo.estado === "CONFIRMADA" && (
              <>
                <Button
                  onClick={handleCheckIn}
                  disabled={isPending}
                  className="w-full h-12 bg-[#0051b3] hover:bg-blue-800 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  Registrar Check-In Físico
                </Button>
                <Button
                  onClick={() => handleUpdateStatus("CANCELADA")}
                  disabled={isPending}
                  variant="outline"
                  className="w-full h-12 rounded-2xl font-bold text-xs text-red-600 border-red-100 hover:bg-red-50 uppercase tracking-widest cursor-pointer"
                >
                  Cancelar Reserva
                </Button>
              </>
            )}

            {aforo.estado === "EN_CURSO" && (
              <Button
                onClick={handleCheckOut}
                disabled={isPending}
                className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-amber-900/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                Registrar Check-Out
              </Button>
            )}

            {(aforo.estado === "COMPLETADA" ||
              aforo.estado === "CANCELADA") && (
              <p className="text-center text-[11px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
                Sin acciones disponibles
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
