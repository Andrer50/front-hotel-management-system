"use client";

import { useState, useMemo } from "react";
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

          // Seleccionar automáticamente
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
                  /* Huésped Seleccionado */
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
                  /* Campo de Búsqueda Autocomplete */
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

                    {/* Dropdown flotante */}
                    {showGuestDropdown && (
                      <>
                        {/* Backdrop invisible para cerrar el dropdown al hacer clic fuera */}
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
                                  Registrar Huésped Temporal (DNI: {guestSearch}
                                  )
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
