"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { Calendar, User, DoorOpen, CreditCard, Globe, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/hotel";

interface CreateReservationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onReservationCreated: () => void;
}

export function CreateReservationDialog({
  isOpen,
  onOpenChange,
  onReservationCreated,
}: CreateReservationDialogProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [huespedes, setHuespedes] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);

  const [formData, setFormData] = useState({
    huesped: "",
    habitacion: "",
    fecha_entrada: "",
    fecha_salida: "",
    tarifa_aplicada: "",
    origen: "DIRECTO",
  });

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [huespedesRes, habitacionesRes] = await Promise.all([
        fetch(`${API_BASE}/select-data`, {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        }),
        fetch(`${API_BASE}/habitaciones?disponibles=true`, {
          headers: { Authorization: `Bearer ${session?.accessToken}` },
        }),
      ]);

      const huespedesResult = await huespedesRes.json();
      const habitacionesResult = await habitacionesRes.json();

      setHuespedes(huespedesResult.data?.huespedes || []);
      setHabitaciones(habitacionesResult.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error al cargar datos");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/reservas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          huesped: parseInt(formData.huesped),
          habitacion: parseInt(formData.habitacion),
          fecha_entrada: formData.fecha_entrada,
          fecha_salida: formData.fecha_salida,
          tarifa_aplicada: parseFloat(formData.tarifa_aplicada),
          origen: formData.origen,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Reserva creada", {
          description: `Código: ${result.data?.codigo_reserva}`,
        });
        onReservationCreated();
        onOpenChange(false);
        setFormData({
          huesped: "",
          habitacion: "",
          fecha_entrada: "",
          fecha_salida: "",
          tarifa_aplicada: "",
          origen: "DIRECTO",
        });
      } else {
        toast.error("Error", { description: result.message || "No se pudo crear la reserva" });
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-brand-blue to-blue-600 p-5 text-white">
          <DialogTitle className="text-lg font-extrabold">Nueva Reserva</DialogTitle>
          <DialogDescription className="text-white/80 text-xs mt-1">
            Complete los datos para registrar una reserva
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {loadingData ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
            </div>
          ) : (
            <>
              <div>
                <Label className="text-xs font-bold flex items-center gap-1 mb-1">
                  <User className="h-3 w-3" /> Huésped
                </Label>
                <Select
                  value={formData.huesped}
                  onValueChange={(val) => setFormData({ ...formData, huesped: val })}
                >
                  <SelectTrigger className="h-10 text-xs rounded-xl">
                    <SelectValue placeholder="Seleccione un huésped" />
                  </SelectTrigger>
                  <SelectContent>
                    {huespedes.map((h: any) => (
                      <SelectItem key={h.id} value={h.id.toString()}>
                        {h.nombre_completo} - {h.documento}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-bold flex items-center gap-1 mb-1">
                  <DoorOpen className="h-3 w-3" /> Habitación
                </Label>
                <Select
                  value={formData.habitacion}
                  onValueChange={(val) => setFormData({ ...formData, habitacion: val })}
                >
                  <SelectTrigger className="h-10 text-xs rounded-xl">
                    <SelectValue placeholder="Seleccione una habitación" />
                  </SelectTrigger>
                  <SelectContent>
                    {habitaciones.map((h: any) => (
                      <SelectItem key={h.id} value={h.id.toString()}>
                        Hab. {h.numero} - {h.tipo_display} (S/. {h.precio_base})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-bold flex items-center gap-1 mb-1">
                    <Calendar className="h-3 w-3" /> Check-in
                  </Label>
                  <Input
                    type="date"
                    value={formData.fecha_entrada}
                    onChange={(e) => setFormData({ ...formData, fecha_entrada: e.target.value })}
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold flex items-center gap-1 mb-1">
                    <Calendar className="h-3 w-3" /> Check-out
                  </Label>
                  <Input
                    type="date"
                    value={formData.fecha_salida}
                    onChange={(e) => setFormData({ ...formData, fecha_salida: e.target.value })}
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-bold flex items-center gap-1 mb-1">
                    <CreditCard className="h-3 w-3" /> Tarifa x noche
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="100.00"
                    value={formData.tarifa_aplicada}
                    onChange={(e) => setFormData({ ...formData, tarifa_aplicada: e.target.value })}
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold flex items-center gap-1 mb-1">
                    <Globe className="h-3 w-3" /> Origen
                  </Label>
                  <Select
                    value={formData.origen}
                    onValueChange={(val) => setFormData({ ...formData, origen: val })}
                  >
                    <SelectTrigger className="h-10 text-xs rounded-xl">
                      <SelectValue placeholder="Origen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DIRECTO">Reserva Directa</SelectItem>
                      <SelectItem value="BOOKING">Booking.com</SelectItem>
                      <SelectItem value="EXPEDIA">Expedia</SelectItem>
                      <SelectItem value="AIRBNB">Airbnb</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                  className="text-xs rounded-xl"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl px-5"
                >
                  {loading ? "Guardando..." : "Crear Reserva"}
                </Button>
              </DialogFooter>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}