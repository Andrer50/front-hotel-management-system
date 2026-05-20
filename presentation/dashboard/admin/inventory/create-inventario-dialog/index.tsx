"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Package } from "lucide-react";
import { InventarioTipo } from "@/core/inventory/interfaces";
import { useCreateInventarioMutation } from "@/modules/inventory/domain/hooks/useInventarioMutations";
import { DEFAULT_SEDE } from "@/modules/inventory/features/constants";
import {
  validateInventarioForm,
  hasFormErrors,
} from "@/modules/inventory/features/validations";

interface CreateInventarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateInventarioDialog({
  open,
  onOpenChange,
}: CreateInventarioDialogProps) {
  const createMutation = useCreateInventarioMutation();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState<InventarioTipo>("SUMINISTRO");
  const [stockActual, setStockActual] = useState("0");
  const [stockMinimo, setStockMinimo] = useState("0");
  const [precioUnitario, setPrecioUnitario] = useState("0.00");

  const resetForm = () => {
    setNombre("");
    setDescripcion("");
    setTipo("SUMINISTRO");
    setStockActual("0");
    setStockMinimo("0");
    setPrecioUnitario("0.00");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      nombre,
      stock_actual: parseInt(stockActual, 10) || 0,
      stock_minimo: parseInt(stockMinimo, 10) || 0,
      precio_unitario: precioUnitario,
    };

    const errors = validateInventarioForm(formData);
    if (hasFormErrors(errors)) {
      const firstError = Object.values(errors)[0];
      toast.error("Datos inválidos", { description: firstError });
      return;
    }

    createMutation.mutate(
      {
        sede: DEFAULT_SEDE,
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        stock_actual: formData.stock_actual,
        stock_minimo: formData.stock_minimo,
        precio_unitario: formData.precio_unitario,
        tipo,
      },
      {
        onSuccess: () => {
          resetForm();
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] rounded-2xl">
        <DialogTitle className="flex items-center gap-2 text-lg font-bold">
          <Package className="h-5 w-5 text-brand-blue" />
          Registrar Artículo
        </DialogTitle>
        <DialogDescription className="text-sm text-dark-secondary">
          Agregue un nuevo suministro o artículo de inventario al catálogo del hotel.
        </DialogDescription>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Coca-Cola 350ml"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción del artículo..."
              className="rounded-xl resize-none"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo *</Label>
            <Select value={tipo} onValueChange={(v) => setTipo(v as InventarioTipo)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SUMINISTRO">Suministro (consumo interno)</SelectItem>
                <SelectItem value="INVENTARIO">Inventario (venta al huésped)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stockActual">Stock Actual</Label>
              <Input
                id="stockActual"
                type="number"
                min={0}
                value={stockActual}
                onChange={(e) => setStockActual(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stockMinimo">Stock Mínimo</Label>
              <Input
                id="stockMinimo"
                type="number"
                min={0}
                value={stockMinimo}
                onChange={(e) => setStockMinimo(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="precio">Precio Unitario (S/)</Label>
            <Input
              id="precio"
              type="number"
              min={0}
              step="0.01"
              value={precioUnitario}
              onChange={(e) => setPrecioUnitario(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-brand-blue hover:bg-blue-600 text-white rounded-xl"
            >
              {createMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Registrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
