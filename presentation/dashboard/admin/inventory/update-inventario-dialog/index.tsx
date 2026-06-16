"use client";

import { useEffect, useState } from "react";
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
import { Loader2, Package, Trash2, TrendingDown } from "lucide-react";
import { Inventario, InventarioTipo } from "@/core/inventory/interfaces";
import {
  useUpdateInventarioMutation,
  useDeleteInventarioMutation,
} from "@/modules/inventory/domain/hooks/useInventarioMutations";
import {
  validateInventarioForm,
  hasFormErrors,
} from "@/modules/inventory/features/validations";
import { StockStatusBadge } from "../stock-status-badge";

interface UpdateInventarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventario: Inventario | null;
}

export function UpdateInventarioDialog({
  open,
  onOpenChange,
  inventario,
}: UpdateInventarioDialogProps) {
  const updateMutation = useUpdateInventarioMutation();
  const deleteMutation = useDeleteInventarioMutation();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState<InventarioTipo>("SUMINISTRO");
  const [stockActual, setStockActual] = useState("0");
  const [stockMinimo, setStockMinimo] = useState("0");
  const [precioUnitario, setPrecioUnitario] = useState("0.00");
  const [quickStock, setQuickStock] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!inventario) return;
    setNombre(inventario.nombre);
    setDescripcion(inventario.descripcion || "");
    setTipo(inventario.tipo);
    setStockActual(inventario.stock_actual.toString());
    setStockMinimo(inventario.stock_minimo.toString());
    setPrecioUnitario(inventario.precio_unitario);
    setQuickStock(inventario.stock_actual.toString());
    setConfirmDelete(false);
  }, [inventario]);

  if (!inventario) return null;

  const isPending = updateMutation.isPending || deleteMutation.isPending;

  const handleSave = (e: React.FormEvent) => {
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

    updateMutation.mutate(
      {
        id: inventario.id,
        data: {
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          stock_actual: formData.stock_actual,
          stock_minimo: formData.stock_minimo,
          precio_unitario: formData.precio_unitario,
          tipo,
        },
      },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  const handleQuickStockAdjust = () => {
    const newStock = parseInt(quickStock, 10);
    if (isNaN(newStock) || newStock < 0) {
      toast.error("Stock inválido", {
        description: "Ingrese un valor numérico mayor o igual a 0",
      });
      return;
    }

    updateMutation.mutate(
      { id: inventario.id, data: { stock_actual: newStock } },
      {
        onSuccess: () => {
          setStockActual(newStock.toString());
          onOpenChange(false);
        },
      },
    );
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    deleteMutation.mutate(inventario.id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="flex items-center gap-2 text-lg font-bold">
          <Package className="h-5 w-5 text-brand-blue" />
          Editar Artículo
        </DialogTitle>
        <DialogDescription className="text-sm text-dark-secondary">
          Actualice los datos del artículo o ajuste el stock tras una auditoría.
        </DialogDescription>

        <div className="flex items-center gap-3 py-2">
          <StockStatusBadge item={inventario} />
        </div>

        <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-brand-blue" />
            <span className="text-xs font-bold text-dark-primary">
              Ajuste rápido de stock
            </span>
          </div>
          <div className="flex gap-2">
            <Input
              type="number"
              min={0}
              value={quickStock}
              onChange={(e) => setQuickStock(e.target.value)}
              className="rounded-xl flex-1"
              placeholder="Nuevo stock actual"
            />
            <Button
              type="button"
              onClick={handleQuickStockAdjust}
              disabled={isPending}
              className="bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-xs shrink-0"
            >
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Aplicar"
              )}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-nombre">Nombre *</Label>
            <Input
              id="edit-nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-descripcion">Descripción</Label>
            <Textarea
              id="edit-descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="rounded-xl resize-none"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={tipo} onValueChange={(v) => setTipo(v as InventarioTipo)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SUMINISTRO">Suministro</SelectItem>
                <SelectItem value="INVENTARIO">Inventario</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-stock">Stock Actual</Label>
              <Input
                id="edit-stock"
                type="number"
                min={0}
                value={stockActual}
                onChange={(e) => setStockActual(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-minimo">Stock Mínimo</Label>
              <Input
                id="edit-minimo"
                type="number"
                min={0}
                value={stockMinimo}
                onChange={(e) => setStockMinimo(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-precio">Precio Unitario (S/)</Label>
            <Input
              id="edit-precio"
              type="number"
              min={0}
              step="0.01"
              value={precioUnitario}
              onChange={(e) => setPrecioUnitario(e.target.value)}
              className="rounded-xl"
            />
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
              className="rounded-xl mr-auto"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              {confirmDelete ? "Confirmar eliminación" : "Eliminar"}
            </Button>
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
              disabled={isPending}
              className="bg-brand-blue hover:bg-blue-600 text-white rounded-xl"
            >
              {updateMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Guardar cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
