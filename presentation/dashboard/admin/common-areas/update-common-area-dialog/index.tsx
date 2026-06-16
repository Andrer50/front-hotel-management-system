"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import {
  ImagePlus,
  Loader2,
  Trash2,
  UploadCloud,
  Settings2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Power,
  PowerOff,
  MapPin,
  Brush,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

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
  const [capacidadMaxima, setCapacidadMaxima] = useState<number>(area?.capacidad_maxima || 0);
  const [categoria, setCategoria] = useState(area?.categoria || "Interiores");
  const [descripcion, setDescripcion] = useState(area?.descripcion || "");
  const [estado, setEstado] = useState<CommonAreaEstado>(area?.estado || "DISPONIBLE");
  const [isActive, setIsActive] = useState<boolean>(area?.is_active ?? true);
  
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

  const handleQuickStatusChange = (newStatus: CommonAreaEstado) => {
    setEstado(newStatus);
    if (area) {
      updateArea(
        { id: area.id, estado: newStatus },
        {
          onSuccess: () => {
            toast.success(`Estado: ${newStatus}`, {
              description: "Estado actualizado rápidamente.",
            });
          },
          onError: (error) => {
            // Revertir estado visual en caso de error
            setEstado(area.estado); 
            toast.error(error.message || "Ocurrió un error al actualizar el estado");
          }
        }
      );
    }
  };

  const handleToggleActive = () => {
    if (!area) return;
    const newValue = !isActive;
    setIsActive(newValue);
    updateArea(
      { id: area.id, is_active: newValue },
      {
        onSuccess: () => {
          toast.success(newValue ? "Área activada" : "Área desactivada", {
            description: newValue
              ? `El área ${area.nombre} está operativa nuevamente.`
              : `El área ${area.nombre} fue desactivada del sistema.`,
          });
        },
        onError: (error) => {
          // Revertir el estado local si falla
          setIsActive(!newValue);
          toast.error(error.message || "No se pudo cambiar el estado de activación.");
        },
      }
    );
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
        is_active: isActive,
        imagen: imagen || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Área Actualizada", {
            description: "Los cambios se guardaron correctamente.",
          });
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message || "Ocurrió un error al guardar los cambios");
        }
      }
    );
  };

  if (!area) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[850px] bg-white rounded-3xl border-none shadow-2xl p-0 overflow-hidden isolate">
        
        {/* Cabecera Premium con Selector de Estado Rápido */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 pb-6 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-6 opacity-5">
            <Settings2 className="h-40 w-40" />
          </div>

          <div className="flex flex-col gap-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-extrabold tracking-tight uppercase">
                    {area.nombre}
                  </DialogTitle>
                  <DialogDescription className="text-white/60 text-[10px] uppercase font-black tracking-widest mt-1">
                    Panel de Gestión Directa
                  </DialogDescription>
                </div>
              </div>
            </div>

            {/* Selector de Estado Rápido (Chips) */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
              {(
                [
                  { id: "DISPONIBLE", label: "DISPONIBLE", color: "bg-emerald-500", icon: CheckCircle2 },
                  { id: "OCUPADA", label: "OCUPADA", color: "bg-zinc-500", icon: Clock },
                  { id: "SUCIA", label: "SUCIA", color: "bg-amber-500", icon: Brush },
                  { id: "MANTENIMIENTO", label: "MTTO.", color: "bg-red-500", icon: AlertTriangle },
                  { id: "RESTRINGIDO", label: "RESTRINGIDO", color: "bg-slate-500", icon: Lock },
                ] as const
              ).map((statusOpt) => {
                const isSelected = estado === statusOpt.id;
                const Icon = statusOpt.icon;
                return (
                  <button
                    key={statusOpt.id}
                    onClick={() => handleQuickStatusChange(statusOpt.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl transition-all duration-300 border cursor-pointer ${
                      isSelected
                        ? `${statusOpt.color} border-transparent text-white shadow-lg scale-105`
                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${isSelected ? "animate-pulse" : ""}`} />
                    <span className="text-[10px] font-black">{statusOpt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Columna Izquierda: Formulario */}
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
                  Descripción / Notas
                </Label>
                <Textarea
                  placeholder="Detalles sobre el área..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="min-h-[100px] bg-zinc-50 border-none rounded-3xl p-4 focus-visible:ring-2 focus-visible:ring-zinc-900 transition-all font-medium resize-none"
                />
              </div>

              {/* Toggle de Activación de Área */}
              <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 mt-2 ${
                isActive ? "bg-emerald-50 border-emerald-200" : "bg-zinc-100 border-zinc-200"
              }`}>
                <div className="flex flex-col gap-0.5">
                  <span className={`text-xs font-extrabold ${isActive ? "text-emerald-700" : "text-zinc-500"}`}>
                    {isActive ? "Área Activa" : "Área Desactivada"}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium">
                    {isActive ? "Visible y operativa." : "Oculta del sistema."}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleToggleActive}
                  disabled={isPending}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-emerald-600 hover:bg-red-500 text-white shadow-md shadow-emerald-600/20"
                      : "bg-zinc-700 hover:bg-emerald-600 text-white shadow-md"
                  }`}
                >
                  {isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : isActive ? (
                    <><PowerOff className="h-3.5 w-3.5" /> Desactivar</>
                  ) : (
                    <><Power className="h-3.5 w-3.5" /> Activar</>
                  )}
                </button>
              </div>
            </div>

            {/* Columna Derecha: Subida de Imagen */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-dark-secondary uppercase tracking-widest ml-1">
                Foto del Área
              </Label>
              <div className="relative group aspect-square md:aspect-auto md:h-[400px]">
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

          {/* Botones de Acción (Footer) */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-zinc-100">
            <Button
              variant="ghost"
              onClick={() => area && onDelete(area.id)}
              className="h-12 w-12 rounded-2xl text-red-500 hover:bg-red-50 hover:text-red-600 border-none transition-colors cursor-pointer p-0 shrink-0"
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
