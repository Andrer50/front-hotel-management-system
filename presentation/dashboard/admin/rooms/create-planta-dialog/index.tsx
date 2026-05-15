import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Layers, Loader2 } from "lucide-react";
import { useCreatePlantaMutation } from "@/modules/room/domain/hooks/usePlantaMutations";

interface CreatePlantaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePlantaDialog({
  isOpen,
  onOpenChange,
}: CreatePlantaDialogProps) {
  const createPlantaMutation = useCreatePlantaMutation();
  const [nombre, setNombre] = useState("");
  const [numero, setNumero] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !numero) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }

    createPlantaMutation.mutate(
      {
        nombre,
        numero: Number(numero),
      },
      {
        onSuccess: () => {
          toast.success("Planta creada", {
            description: `Se ha registrado la ${nombre} correctamente.`,
          });
          setNombre("");
          setNumero("");
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error("Error al crear planta", {
            description:
              error.message || "Verifique que el número no esté duplicado.",
          });
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm rounded-2xl bg-white border border-zinc-100 shadow-xl p-6">
        <DialogHeader>
          <div className="bg-blue-50 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
            <Layers className="h-5 w-5 text-blue-600" />
          </div>
          <DialogTitle className="text-lg font-bold">
            Nueva Planta / Piso
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="planta-nombre" className="text-xs font-bold">
              Nombre de la Planta
            </Label>
            <Input
              id="planta-nombre"
              placeholder="Ej. Planta 1, Sótano, Ático"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="rounded-xl border-zinc-200 h-10 text-xs"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="planta-numero" className="text-xs font-bold">
              Número (Orden)
            </Label>
            <Input
              id="planta-numero"
              type="number"
              placeholder="Ej. 1"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              className="rounded-xl border-zinc-200 h-10 text-xs"
            />
          </div>

          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-xs font-bold"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createPlantaMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs"
            >
              {createPlantaMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Crear Planta"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
