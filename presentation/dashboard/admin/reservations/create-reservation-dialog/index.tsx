"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
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
import {
  Calendar,
  User,
  DoorOpen,
  CreditCard,
  Globe,
  Loader2,
  Search,
  X,
  Plus,
} from "lucide-react";
import { useSession } from "next-auth/react"; // ← Inyectamos useSession de NextAuth
import { SelectGuest } from "@/core/guest/interfaces";
import { useCreateGuestMutation } from "@/modules/guest/domain/hooks/useGuestMutations";
import { useGetGuestSelectDataQuery } from "@/modules/guest/domain/hooks/useGuestQueries";
import { useGetAvailableRoomsQuery } from "@/modules/room/domain/hooks/useRoomQueries";
import { useCreateReservationMutation } from "@/modules/reservation/domain/hooks/useReservationMutations";

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
  const { data: session }: any = useSession(); // ← Capturamos la sesión interna activa
  const createGuestMutation = useCreateGuestMutation();
  const createReservationMutation = useCreateReservationMutation();

  const { data: selectData, isLoading: isLoadingSelectData } =
    useGetGuestSelectDataQuery();
  const { data: habitaciones = [], isLoading: isLoadingRooms } =
    useGetAvailableRoomsQuery();

  const huespedes = useMemo(() => selectData?.huespedes || [], [selectData]);
  const loadingData = isLoadingSelectData || isLoadingRooms;

  const [formData, setFormData] = useState({
    huesped: "",
    habitacion: "",
    fecha_entrada: "",
    fecha_salida: "",
    tarifa_aplicada: "",
    origen: "DIRECTO",
  });

  // ========== ESTADOS PARA LA TARIFA DINÁMICA POR TEMPORADA ==========
  const [mensajeTemporada, setMensajeTemporada] = useState("");

  // Estados para el buscador autocomplete de huéspedes
  const [selectedGuest, setSelectedGuest] = useState<SelectGuest | null>(null);
  const [guestSearch, setGuestSearch] = useState("");
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);

  const filteredHuespedes = useMemo(() => {
    if (!guestSearch) return huespedes;
    return huespedes.filter(
      (h) =>
        h.documento?.includes(guestSearch) ||
        h.nombre_completo?.toLowerCase().includes(guestSearch.toLowerCase()),
    );
  }, [huespedes, guestSearch]);

  // ========== LOGICA INTERNA: CÁLCULO DE TARIFA TOTALMENTE DINÁMICA POR % ==========
  const calcularTarifaPorTemporada = async (fechaEntrada: string, habitacionId: string) => {
    if (!fechaEntrada || !habitacionId) return;

    // Buscamos la habitación seleccionada en la lista para sacar su precio_base real
    const habitacionSeleccionada = habitaciones.find((h) => h.id.toString() === habitacionId);
    if (!habitacionSeleccionada) return;

    const precioBase = parseFloat(habitacionSeleccionada.precio_base) || 0;
    const token = session?.accessToken || session?.user?.token || session?.token;

    try {
      const response = await fetch("http://localhost:8000/api/hotel/temporadas", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const resData = await response.json();

      if (response.ok && resData.status === "success") {
        const listaTemporadas = resData.data || [];
        
        // Convertimos la fecha de entrada digitada para compararla
        const fechaTarget = new Date(fechaEntrada + "T00:00:00");

        // Verificamos si cae en el rango de alguna temporada activa
        const temporadaChoca = listaTemporadas.find((temp: any) => {
          const inicio = new Date(temp.fecha_inicio + "T00:00:00");
          const fin = new Date(temp.fecha_fin + "T00:00:00");
          return fechaTarget >= inicio && fechaTarget <= fin;
        });

        if (temporadaChoca) {
          // 🔥 LEEMOS EL PORCENTAJE REAL DE LA BASE DE DATOS. Si es undefined (old schemas), default a 0.
          const porcentaje = temporadaChoca.porcentaje !== undefined ? temporadaChoca.porcentaje : 0;

          // Operación matemática pura y limpia
          const factor = 1 + (porcentaje / 100); // Ej: 30 -> 1.30 | -50 -> 0.50
          const tarifaCalculada = precioBase * factor;

          setFormData((prev) => ({ ...prev, tarifa_aplicada: tarifaCalculada.toFixed(2) }));

          // Construimos el mensaje ideal para el recepcionista según el signo del porcentaje
          if (porcentaje > 0) {
            setMensajeTemporada(`📈 Tarifa Especial: ${temporadaChoca.nombre} (+${porcentaje}%)`);
          } else if (porcentaje < 0) {
            setMensajeTemporada(`📉 Descuento Aplicado: ${temporadaChoca.nombre} (${porcentaje}%)`);
          } else {
            setMensajeTemporada(`✨ Campaña activa: ${temporadaChoca.nombre} (Precio Base)`);
          }
        } else {
          // Sin temporada: Tarifa normal de la habitación
          setFormData((prev) => ({ ...prev, tarifa_aplicada: precioBase.toFixed(2) }));
          setMensajeTemporada("");
        }
      }
    } catch (error) {
      console.error("Error cruzando tarifas con temporadas", error);
    }
  };

  // Escucha cambios en la fecha de entrada o en la habitación para recalcular al instante
  useEffect(() => {
    if (formData.fecha_entrada && formData.habitacion) {
      calcularTarifaPorTemporada(formData.fecha_entrada, formData.habitacion);
    }
  }, [formData.fecha_entrada, formData.habitacion, habitaciones]);

  const handleSelectGuest = (guest: SelectGuest) => {
    setSelectedGuest(guest);
    setFormData((prev) => ({ ...prev, huesped: guest.id.toString() }));
    setGuestSearch("");
    setShowGuestDropdown(false);
  };

  const handleClearGuest = () => {
    setSelectedGuest(null);
    setFormData((prev) => ({ ...prev, huesped: "" }));
    setGuestSearch("");
  };

  const handleQuickCreateGuest = () => {
    if (!guestSearch || guestSearch.trim().length < 4) {
      toast.error("Por favor ingrese un DNI de al menos 4 dígitos");
      return;
    }

    createGuestMutation.mutate(
      {
        nombre: "Huésped",
        apellido: "Pendiente",
        documento: guestSearch,
        email: `${guestSearch}@temp.com`,
        tipo_documento: "DNI",
        telefono: "",
        status: "ACTIVE",
      },
      {
        onSuccess: (createdGuest) => {
          toast.success("Huésped temporal registrado");
          const newGuest: SelectGuest = {
            id: createdGuest.id,
            nombre_completo: `${createdGuest.nombre} ${createdGuest.apellido}`,
            documento: createdGuest.documento,
          };
          handleSelectGuest(newGuest);
        },
      },
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createReservationMutation.mutate(
      {
        huesped: parseInt(formData.huesped),
        habitacion: parseInt(formData.habitacion),
        fecha_entrada: formData.fecha_entrada,
        fecha_salida: formData.fecha_salida,
        tarifa_aplicada: parseFloat(formData.tarifa_aplicada),
        origen: formData.origen,
      },
      {
        onSuccess: (result) => {
          toast.success("Reserva creada", {
            description: `Código: ${result.codigo_reserva}`,
          });
          onReservationCreated();
          onOpenChange(false);
          setSelectedGuest(null);
          setGuestSearch("");
          setMensajeTemporada("");
          setFormData({
            huesped: "",
            habitacion: "",
            fecha_entrada: "",
            fecha_salida: "",
            tarifa_aplicada: "",
            origen: "DIRECTO",
          });
        },
        onError: (error) => {
          toast.error("Error", {
            description: error.message || "No se pudo crear la reserva",
          });
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-brand-blue to-blue-600 p-5 text-white">
          <DialogTitle className="text-lg font-extrabold">
            Nueva Reserva
          </DialogTitle>
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
              <div className="relative">
                <Label className="text-xs font-bold flex items-center gap-1 mb-1">
                  <User className="h-3 w-3" /> Huésped
                </Label>

                {selectedGuest ? (
                  <div className="flex items-center justify-between h-10 px-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold">
                    <span className="text-zinc-800">
                      {selectedGuest.nombre_completo} (DNI:{" "}
                      {selectedGuest.documento})
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleClearGuest}
                      className="h-6 w-6 text-zinc-500 hover:text-red-500 rounded-full cursor-pointer hover:bg-zinc-200/50"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="relative">
                      <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <Input
                        type="text"
                        placeholder="Ingrese DNI o nombre para buscar..."
                        value={guestSearch}
                        onChange={(e) => {
                          setGuestSearch(e.target.value);
                          setShowGuestDropdown(true);
                        }}
                        onFocus={() => setShowGuestDropdown(true)}
                        className="pl-9 pr-3 h-10 text-xs rounded-xl"
                      />
                      {guestSearch && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setGuestSearch("")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent text-zinc-400 hover:text-zinc-600 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

                    {showGuestDropdown && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowGuestDropdown(false)}
                        />
                        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg max-h-[180px] overflow-y-auto z-20 p-1 flex flex-col gap-0.5">
                          {filteredHuespedes.length > 0 ? (
                            filteredHuespedes.map((h) => (
                              <button
                                key={h.id}
                                type="button"
                                onClick={() => handleSelectGuest(h)}
                                className="w-full text-left px-3 py-2 text-xs hover:bg-zinc-50 rounded-lg font-semibold text-zinc-700 flex items-center justify-between cursor-pointer"
                              >
                                <span>{h.nombre_completo}</span>
                                <span className="text-[10px] text-zinc-500 font-mono">
                                  DNI: {h.documento}
                                </span>
                              </button>
                            ))
                          ) : (
                            <div className="p-3 text-center flex flex-col items-center gap-2">
                              <p className="text-xs text-zinc-500 font-semibold">
                                No se encontró ningún huésped.
                              </p>
                              {guestSearch.trim().length >= 4 && (
                                <Button
                                  type="button"
                                  onClick={handleQuickCreateGuest}
                                  disabled={createGuestMutation.isPending}
                                  className="w-full bg-[#031c46] hover:bg-blue-900 text-white font-bold text-[10px] h-8 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  {createGuestMutation.isPending ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <Plus className="h-3 w-3" />
                                  )}
                                  Registrar Huésped Temporal (DNI: {guestSearch})
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-xs font-bold flex items-center gap-1 mb-1">
                  <DoorOpen className="h-3 w-3" /> Habitación
                </Label>
                <Select
                  value={formData.habitacion}
                  onValueChange={(val) =>
                    setFormData({ ...formData, habitacion: val })
                  }
                >
                  <SelectTrigger className="h-10 text-xs rounded-xl">
                    <SelectValue placeholder="Seleccione una habitación" />
                  </SelectTrigger>
                  <SelectContent>
                    {habitaciones.map((h) => (
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fecha_entrada: e.target.value,
                      })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, fecha_salida: e.target.value })
                    }
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
              </div>

              {/* ========== ALERTA DE TEMPORADA REAL BASADA EN EL % DE LA BD ========== */}
              {mensajeTemporada && (
                <div className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 rounded-xl animate-fade-in flex items-center gap-1.5 shadow-xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  {mensajeTemporada}
                </div>
              )}

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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tarifa_aplicada: e.target.value,
                      })
                    }
                    className="h-10 text-xs rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold flex items-center gap-1 mb-1">
                    <Globe className="h-3 w-3" /> Origen
                  </Label>
                  <Select
                    value={formData.origen}
                    onValueChange={(val) =>
                      setFormData({ ...formData, origen: val })
                    }
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
                  disabled={createReservationMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl px-5"
                >
                  {createReservationMutation.isPending
                    ? "Guardando..."
                    : "Crear Reserva"}
                </Button>
              </DialogFooter>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}