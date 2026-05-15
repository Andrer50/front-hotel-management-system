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
import { useUpdateCommonAreaMutation } from "@/modules/common-area/domain/hooks/useCommonAreaMutations";
import { CommonArea, CommonAreaEstado } from "@/core/common-area/interfaces";
import { ImagePlus, Loader2, Trash2, UploadCloud, X } from "lucide-react";

interface UpdateCommonAreaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  area: CommonArea | null;
  onDelete: (id: number) => void;
}

export const UpdateCommonAreaDialog = ({
  open,
  onOpenChange,
  area,
  onDelete,
}: UpdateCommonAreaDialogProps) => {
  const { mutate: updateArea, isPending } = useUpdateCommonAreaMutation();

  const [nombre, setNombre] = useState(area?.nombre || "");
  const [capacidadMaxima, setCapacidadMaxima] = useState<number>(
    area?.capacidad_maxima || 0,
  );
  const [categoria, setCategoria] = useState(area?.categoria || "Interiores");
  const [descripcion, setDescripcion] = useState(area?.descripcion || "");
  const [estado, setEstado] = useState<CommonAreaEstado>(
    area?.estado || "DISPONIBLE",
  );
  const [imagen, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagen(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!area) return;
    updateArea(
      {
        id: area.id,
        nombre,
        capacidad_maxima: capacidadMaxima,
        categoria,
        descripcion,
        estado,
        imagen: imagen || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[850px] bg-white rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-8 pb-4 bg-zinc-900 text-white relative">
          <DialogTitle className="text-2xl font-bold tracking-tight uppercase">
            EDITAR: {area?.nombre}
          </DialogTitle>
          <p className="text-zinc-400 text-xs font-bold mt-1 uppercase tracking-widest">
            Actualización de área común
          </p>
        </DialogHeader>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left Column: Form Inputs */}
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-dark-secondary uppercase tracking-widest ml-1">
                    Nombre del Área
                  </Label>
                  <Input
                    placeholder="Ej: Piscina, Gimnasio..."
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="h-12 bg-zinc-50 border-none rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-zinc-900 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-dark-secondary uppercase tracking-widest ml-1">
                    Aforo Máximo
                  </Label>
                  <Input
                    type="number"
                    value={capacidadMaxima}
                    onChange={(e) => setCapacidadMaxima(Number(e.target.value))}
                    className="h-12 bg-zinc-50 border-none rounded-2xl px-4 focus-visible:ring-2 focus-visible:ring-zinc-900 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-dark-secondary uppercase tracking-widest ml-1">
                    Categoría
                  </Label>
                  <Select value={categoria} onValueChange={setCategoria}>
                    <SelectTrigger className="h-12 bg-zinc-50 border-none rounded-2xl px-4 focus:ring-2 focus:ring-zinc-900 transition-all font-medium">
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-zinc-100 shadow-xl">
                      <SelectItem value="Interiores">Interiores</SelectItem>
                      <SelectItem value="Exteriores">Exteriores</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-dark-secondary uppercase tracking-widest ml-1">
                    Estado Actual
                  </Label>
                  <Select
                    value={estado}
                    onValueChange={(v) => setEstado(v as CommonAreaEstado)}
                  >
                    <SelectTrigger className="h-12 bg-zinc-50 border-none rounded-2xl px-4 focus:ring-2 focus:ring-zinc-900 transition-all font-medium">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-zinc-100 shadow-xl">
                      <SelectItem value="DISPONIBLE">Disponible</SelectItem>
                      <SelectItem value="MANTENIMIENTO">Mantenimiento</SelectItem>
                      <SelectItem value="RESTRINGIDO">Restringido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-dark-secondary uppercase tracking-widest ml-1">
                  Descripción / Notas
                </Label>
                <Textarea
                  placeholder="Detalles sobre el área..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="min-h-[120px] bg-zinc-50 border-none rounded-3xl p-4 focus-visible:ring-2 focus-visible:ring-zinc-900 transition-all font-medium resize-none"
                />
              </div>
            </div>

            {/* Right Column: Image Upload */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-dark-secondary uppercase tracking-widest ml-1">
                Foto del Área
              </Label>
              <div className="relative group aspect-square md:aspect-auto md:h-[305px]">
                {preview || (area?.imagen && !imagen) ? (
                  <div className="relative w-full h-full rounded-3xl overflow-hidden group">
                    <img
                      src={
                        preview ||
                        (area?.imagen?.startsWith("http")
                          ? area.imagen
                          : `http://127.0.0.1:8000${area?.imagen}`)
                      }
                      alt="Preview"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <ImagePlus className="h-8 w-8 text-white" />
                        <span className="text-white text-xs font-bold uppercase tracking-widest">
                          Cambiar Foto
                        </span>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-zinc-200 rounded-3xl bg-zinc-50/50 hover:bg-zinc-50 hover:border-zinc-400 transition-all cursor-pointer group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                      <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud className="h-8 w-8 text-zinc-400 group-hover:text-zinc-600" />
                      </div>
                      <p className="mb-2 text-sm text-zinc-600 font-bold uppercase tracking-tight">
                        Haz clic para subir foto
                      </p>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                        PNG, JPG UP TO 5MB
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-4 mt-10">
            <Button
              variant="ghost"
              onClick={() => area && onDelete(area.id)}
              className="h-12 w-12 rounded-2xl text-red-500 hover:bg-red-50 hover:text-red-600 border-none transition-colors cursor-pointer p-0"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 rounded-2xl font-bold text-xs text-dark-secondary hover:bg-zinc-100 uppercase tracking-widest cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending || !nombre}
              className="flex-[2] h-12 bg-zinc-900 hover:bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-zinc-900/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "GUARDAR CAMBIOS"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
