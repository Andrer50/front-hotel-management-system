"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";
import { useUpdateReservationMutation } from "@/modules/reservation/domain/hooks/useReservationMutations";
import { Reservation } from "@/core/reservation/actions/reservationActions";

interface UpdateReservationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: Reservation | null;
  onReservationUpdated: () => void;
}

export function UpdateReservationDialog({
  isOpen,
  onOpenChange,
  reservation,
  onReservationUpdated,
}: UpdateReservationDialogProps) {
  const updateReservationMutation = useUpdateReservationMutation();
  const [formData, setFormData] = useState<{
    estado: Reservation["estado"];
    tarifa_aplicada: string;
  }>({
    estado: reservation?.estado || "PENDIENTE",
    tarifa_aplicada: reservation?.tarifa_aplicada?.toString() || "",
  });

  const estados = [
    { value: "PENDIENTE", label: "Pendiente" },
    { value: "CONFIRMADA", label: "Confirmada" },
    { value: "EN_CURSO", label: "En Curso" },
    { value: "COMPLETADA", label: "Completada" },
    { value: "CANCELADA", label: "Cancelada" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservation) return;

    updateReservationMutation.mutate(
      {
        id: reservation.id,
        data: {
          estado: formData.estado,
          tarifa_aplicada: parseFloat(formData.tarifa_aplicada),
        },
      },
      {
        onSuccess: () => {
          toast.success("Reserva actualizada", {
            description: `Estado: ${formData.estado}`,
          });
          onReservationUpdated();
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error("Error", {
            description: error.message || "No se pudo actualizar la reserva",
          });
        },
      },
    );
  };

  if (!reservation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-5 sticky top-0">
          <DialogTitle className="font-heading text-lg font-extrabold text-white">
            Modificar Reserva
          </DialogTitle>
          <DialogDescription className="text-white/80 text-xs mt-1">
            Código: {reservation.codigo_reserva} | Huésped:{" "}
            {reservation.huesped_nombre}
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {/* Estado */}
          <div>
            <Label
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: "4px",
                display: "block",
              }}
            >
              Estado de Reserva
            </Label>
            <Select
              value={formData.estado}
              onValueChange={(val) => setFormData({ ...formData, estado: val as Reservation["estado"] })}
            >
              <SelectTrigger
                style={{
                  height: "40px",
                  fontSize: "14px",
                  borderRadius: "12px",
                  backgroundColor: "white",
                  borderColor: "#d1d5db",
                  color: "#111827",
                }}
              >
                <SelectValue placeholder="Seleccione un estado" />
              </SelectTrigger>
              <SelectContent>
                {estados.map((e) => (
                  <SelectItem
                    key={e.value}
                    value={e.value}
                    style={{ color: "#111827" }}
                  >
                    {e.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tarifa */}
          <div>
            <Label
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: "4px",
                display: "block",
              }}
            >
              <CreditCard
                style={{
                  height: "12px",
                  width: "12px",
                  display: "inline",
                  marginRight: "4px",
                }}
              />{" "}
              Tarifa por noche (S/.)
            </Label>
            <Input
              type="number"
              step="0.01"
              value={formData.tarifa_aplicada}
              onChange={(e) =>
                setFormData({ ...formData, tarifa_aplicada: e.target.value })
              }
              style={{
                height: "40px",
                fontSize: "14px",
                borderRadius: "12px",
                backgroundColor: "white",
                borderColor: "#d1d5db",
                color: "#111827",
              }}
            />
          </div>

          {/* Botones */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              marginTop: "16px",
              backgroundColor: "white",
              paddingTop: "8px",
              position: "sticky",
              bottom: 0,
            }}
          >
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              style={{
                fontSize: "14px",
                borderRadius: "12px",
                color: "#4b5563",
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateReservationMutation.isPending}
              style={{
                backgroundColor: "#d97706",
                color: "white",
                fontSize: "14px",
                borderRadius: "12px",
                paddingLeft: "20px",
                paddingRight: "20px",
              }}
            >
              {updateReservationMutation.isPending
                ? "Guardando..."
                : "Actualizar Reserva"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
