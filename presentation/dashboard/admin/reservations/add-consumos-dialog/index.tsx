"use client";

import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  ShoppingBag,
  Utensils,
  GlassWater,
  Shirt,
  Sparkles,
} from "lucide-react";
import { useGetInventariosQuery } from "@/modules/inventory/domain/hooks/useInventarioQueries";
import { useGetConsumosExtraQuery } from "@/modules/consumo-extra/domain/hooks/useConsumoExtraQueries";
import { useCreateConsumoExtraMutation } from "@/modules/consumo-extra/domain/hooks/useConsumoExtraMutations";
import { Inventario } from "@/core/inventory/interfaces";
import { Reservation } from "@/core/reservation/interfaces";

interface AddConsumosDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: Reservation | null;
}

export function AddConsumosDialog({
  isOpen,
  onOpenChange,
  reservation,
}: AddConsumosDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [customItemMode, setCustomItemMode] = useState(false);

  // Custom item form state
  const [customDesc, setCustomDesc] = useState("");
  const [customQty, setCustomQty] = useState(1);
  const [customPrice, setCustomPrice] = useState("");

  const reservaId = reservation?.id || 0;

  // Queries and mutations
  const { data: inventory = [], isLoading: isLoadingInventory } =
    useGetInventariosQuery();
  const { data: consumos = [], isLoading: isLoadingConsumos } =
    useGetConsumosExtraQuery(reservaId);
  const addConsumoMutation = useCreateConsumoExtraMutation(reservaId);

  // Filter inventory items for the list
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) =>
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [inventory, searchTerm]);

  // Calculate accumulated charges
  const totalAccumulated = useMemo(() => {
    return consumos.reduce(
      (acc, c) => acc + parseFloat(c.precio_unitario) * c.cantidad,
      0,
    );
  }, [consumos]);

  const handleAddInventoryItem = (item: Inventario) => {
    if (item.stock_actual <= 0) {
      toast.error(`No hay stock disponible para ${item.nombre}`);
      return;
    }

    addConsumoMutation.mutate({
      reserva: reservaId,
      inventario: item.id,
      descripcion: item.nombre,
      cantidad: 1,
      precio_unitario: item.precio_unitario.toString(),
    });
  };

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDesc.trim()) {
      toast.error("Por favor, ingrese una descripción");
      return;
    }
    if (customQty <= 0) {
      toast.error("La cantidad debe ser mayor a 0");
      return;
    }
    if (!customPrice || parseFloat(customPrice) < 0) {
      toast.error("Por favor, ingrese un precio válido");
      return;
    }

    addConsumoMutation.mutate(
      {
        reserva: reservaId,
        descripcion: customDesc,
        cantidad: customQty,
        precio_unitario: parseFloat(customPrice).toFixed(2),
      },
      {
        onSuccess: () => {
          setCustomDesc("");
          setCustomQty(1);
          setCustomPrice("");
          setCustomItemMode(false);
        },
      },
    );
  };

  // Helper to guess category icon
  const getCategoryIcon = (name: string, tipo: string) => {
    const lname = name.toLowerCase();
    if (
      lname.includes("agua") ||
      lname.includes("gaseosa") ||
      lname.includes("vino") ||
      lname.includes("limonada") ||
      lname.includes("bebida") ||
      lname.includes("pisco")
    ) {
      return <GlassWater className="h-4 w-4 text-blue-500" />;
    }
    if (
      lname.includes("almuerzo") ||
      lname.includes("desayuno") ||
      lname.includes("cena") ||
      lname.includes("comida") ||
      lname.includes("sanguche") ||
      lname.includes("snack")
    ) {
      return <Utensils className="h-4 w-4 text-amber-500" />;
    }
    if (
      lname.includes("planchado") ||
      lname.includes("lavado") ||
      lname.includes("lavanderia") ||
      lname.includes("ropa")
    ) {
      return <Shirt className="h-4 w-4 text-purple-500" />;
    }
    return <ShoppingBag className="h-4 w-4 text-zinc-500" />;
  };

  if (!reservation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white rounded-2xl p-0 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header con diseño premium */}
        <div className="bg-[#031c46] p-5 text-white flex-shrink-0">
          <DialogTitle className="text-base font-extrabold tracking-wider text-center uppercase">
            REGISTRO DE CONSUMOS EXTRA
          </DialogTitle>
          <div className="mt-4 bg-[#0a2f6c]/60 border border-blue-800/40 rounded-xl p-3 grid grid-cols-3 gap-2 text-xs text-blue-100 divide-x divide-blue-800/40">
            <div className="px-1 text-center min-w-0">
              <span className="opacity-70 block text-[9px] uppercase tracking-wider mb-0.5">
                Huésped
              </span>
              <span
                className="text-white font-bold block truncate"
                title={reservation.huesped_nombre}
              >
                {reservation.huesped_nombre}
              </span>
            </div>
            <div className="px-1 text-center min-w-0">
              <span className="opacity-70 block text-[9px] uppercase tracking-wider mb-0.5">
                Habitación
              </span>
              <span className="text-white font-bold block truncate">
                {reservation.habitacion_numero}
              </span>
            </div>
            <div className="px-1 text-center min-w-0">
              <span className="opacity-70 block text-[9px] uppercase tracking-wider mb-0.5">
                Código
              </span>
              <span
                className="text-white font-mono font-bold block truncate"
                title={reservation.codigo_reserva}
              >
                {reservation.codigo_reserva}
              </span>
            </div>
          </div>
        </div>

        {/* Contenido en Scroll */}
        <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-6">
          {/* SECCIÓN 1: AGREGAR NUEVO CONSUMO */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-zinc-700 tracking-wider uppercase">
                {customItemMode
                  ? "Agregar Consumo Personalizado"
                  : "Artículos Disponibles en Inventario"}
              </h4>
              <Button
                variant="link"
                onClick={() => setCustomItemMode(!customItemMode)}
                className="text-xs font-bold text-brand-blue p-0 h-auto"
              >
                {customItemMode
                  ? "Ver catálogo del inventario"
                  : "Registrar artículo personalizado"}
              </Button>
            </div>

            {customItemMode ? (
              /* FORMULARIO DE ARTÍCULO PERSONALIZADO */
              <form
                onSubmit={handleAddCustomItem}
                className="bg-zinc-50 border border-zinc-100 p-4 rounded-xl flex flex-col gap-3 animate-fade-in"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <Label
                      htmlFor="customDesc"
                      className="text-[10px] font-bold text-zinc-500 uppercase"
                    >
                      Descripción del cargo o servicio
                    </Label>
                    <Input
                      id="customDesc"
                      type="text"
                      placeholder="Ej. Limonada Frozen, Planchado urgente, Masaje"
                      value={customDesc}
                      onChange={(e) => setCustomDesc(e.target.value)}
                      className="h-10 text-xs rounded-xl bg-white"
                      disabled={addConsumoMutation.isPending}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label
                      htmlFor="customPrice"
                      className="text-[10px] font-bold text-zinc-500 uppercase"
                    >
                      Precio Unitario (S/.)
                    </Label>
                    <Input
                      id="customPrice"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      className="h-10 text-xs rounded-xl bg-white"
                      disabled={addConsumoMutation.isPending}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-200/50">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="customQty"
                      className="text-[10px] font-bold text-zinc-500 uppercase"
                    >
                      Cantidad:
                    </Label>
                    <Input
                      id="customQty"
                      type="number"
                      min="1"
                      value={customQty}
                      onChange={(e) =>
                        setCustomQty(parseInt(e.target.value) || 1)
                      }
                      className="w-20 h-8 text-xs rounded-lg text-center"
                      disabled={addConsumoMutation.isPending}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-[#031c46] hover:bg-blue-900 text-white font-bold text-xs h-9 px-5 rounded-xl flex items-center gap-1 cursor-pointer"
                    disabled={addConsumoMutation.isPending}
                  >
                    {addConsumoMutation.isPending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                    Cargar a Cuenta
                  </Button>
                </div>
              </form>
            ) : (
              /* BUSCADOR Y LISTADO DE INVENTARIO */
              <div className="flex flex-col gap-3">
                <Input
                  type="text"
                  placeholder="Buscar artículos del inventario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 text-xs rounded-xl bg-white"
                />

                {isLoadingInventory ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-brand-blue" />
                  </div>
                ) : filteredInventory.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[230px] overflow-y-auto pr-1">
                    {filteredInventory.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-zinc-50 border border-zinc-100 hover:border-zinc-200 rounded-xl transition-all gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className="h-9 w-9 rounded-lg bg-white border border-zinc-200/60 flex items-center justify-center flex-shrink-0">
                            {getCategoryIcon(item.nombre, item.tipo)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className="text-xs font-bold text-zinc-800 truncate"
                              title={item.nombre}
                            >
                              {item.nombre}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-zinc-500 font-semibold flex-wrap">
                              <span className="text-[#031c46] font-bold">
                                S/.{" "}
                                {parseFloat(item.precio_unitario).toFixed(2)}
                              </span>
                              <span className="text-zinc-300">•</span>
                              <span>
                                Stock:{" "}
                                <span
                                  className={
                                    item.stock_actual <= item.stock_minimo
                                      ? "text-red-500 font-bold"
                                      : "text-green-600"
                                  }
                                >
                                  {item.stock_actual}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <Button
                            size="sm"
                            onClick={() => handleAddInventoryItem(item)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] h-8 px-3 rounded-xl flex items-center gap-0.5 cursor-pointer"
                            disabled={
                              addConsumoMutation.isPending ||
                              item.stock_actual <= 0
                            }
                          >
                            <Plus className="h-3 w-3" /> Añadir
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-6 text-xs text-zinc-500 font-semibold bg-zinc-50 border border-dashed rounded-xl">
                    No se encontraron artículos en el catálogo
                  </p>
                )}
              </div>
            )}
          </div>

          <hr className="border-zinc-100" />

          {/* SECCIÓN 2: CARGOS ACUMULADOS / HISTORIAL */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-zinc-700 tracking-wider uppercase">
                Consumos Extra Registrados
              </h4>
              <span className="text-xs text-zinc-500 font-semibold">
                {consumos.length} artículo(s)
              </span>
            </div>

            {isLoadingConsumos ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-brand-blue" />
              </div>
            ) : consumos.length > 0 ? (
              <div className="border border-zinc-100 rounded-xl overflow-hidden bg-white max-h-[220px] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 text-[9px] font-bold text-zinc-500 tracking-widest uppercase border-b border-zinc-100">
                      <th className="p-3">Detalle</th>
                      <th className="p-3 text-center">Cant.</th>
                      <th className="p-3 text-right">Precio Unit.</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consumos.map((c) => (
                      <tr
                        key={c.id}
                        className="border-b border-zinc-50 text-xs hover:bg-zinc-50/50"
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-2 font-bold text-zinc-800">
                            {getCategoryIcon(
                              c.descripcion,
                              c.inventario ? "INVENTARIO" : "CUSTOM",
                            )}
                            <span>{c.descripcion}</span>
                          </div>
                        </td>
                        <td className="p-3 text-center font-semibold text-zinc-600">
                          x{c.cantidad}
                        </td>
                        <td className="p-3 text-right font-medium text-zinc-600">
                          S/. {parseFloat(c.precio_unitario).toFixed(2)}
                        </td>
                        <td className="p-3 text-right font-bold text-zinc-800">
                          S/.{" "}
                          {(parseFloat(c.precio_unitario) * c.cantidad).toFixed(
                            2,
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 text-zinc-500 bg-zinc-50 border border-dashed rounded-xl flex flex-col items-center justify-center gap-1.5">
                <Sparkles className="h-6 w-6 text-zinc-400" />
                <p className="text-xs font-semibold">
                  Aún no se han registrado consumos extras en esta estadía.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer con Cargos Acumulados */}
        <div className="border-t border-zinc-100 p-5 bg-zinc-50/70 flex items-center justify-between flex-shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest">
              Cargos Acumulados
            </span>
            <span className="text-xl font-extrabold text-brand-blue tracking-tight">
              S/. {totalAccumulated.toFixed(2)}
            </span>
          </div>
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-[#031c46] hover:bg-blue-900 text-white text-xs font-bold px-6 h-11 rounded-xl cursor-pointer"
          >
            Cerrar Registro
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
