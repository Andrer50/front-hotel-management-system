"use client";

import { Plus, Loader2, TrendingUp, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { 
  useCreateTemporadaMutation, 
  useUpdateTemporadaMutation 
} from "@/modules/temporada/domain/hooks/useTemporadaMutations";
import { Temporada } from "@/core/temporada/interfaces";

interface CreateTemporadaDialogProps {
  onTemporadaCreated: () => void;
  temporadaAEditar: Temporada | null;       // ← Recibe la temporada seleccionada
  setTemporadaAEditar: (val: Temporada | null) => void; // ← Función para limpiar estado
}

export function CreateTemporadaDialog({ 
  onTemporadaCreated, 
  temporadaAEditar, 
  setTemporadaAEditar 
}: CreateTemporadaDialogProps) {
  const createMutation = useCreateTemporadaMutation();
  const updateMutation = useUpdateTemporadaMutation();

  const [nombre, setNombre] = useState(temporadaAEditar?.nombre || "");
  const [fechaInicio, setFechaInicio] = useState(temporadaAEditar?.fecha_inicio || "");
  const [fechaFin, setFechaFin] = useState(temporadaAEditar?.fecha_fin || "");
  const [porcentaje, setPorcentaje] = useState(
    temporadaAEditar?.porcentaje !== undefined ? temporadaAEditar.porcentaje.toString() : ""
  );

  const isPending = createMutation.isPending || updateMutation.isPending;

  const limpiarFormulario = () => {
    setNombre("");
    setFechaInicio("");
    setFechaFin("");
    setPorcentaje("");
    setTemporadaAEditar(null);
  };

  const handleSaveTemporada = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre || !fechaInicio || !fechaFin || !porcentaje) {
      toast.warning("Campos incompletos", { description: "Por favor llena todos los datos obligatorios." });
      return;
    }

    const valorPorcentaje = parseInt(porcentaje);
    if (isNaN(valorPorcentaje)) {
      toast.warning("Impacto inválido", { description: "Por favor introduce un número válido." });
      return;
    }

    const data = { 
      nombre, 
      fecha_inicio: fechaInicio, 
      fecha_fin: fechaFin, 
      porcentaje: valorPorcentaje, 
      is_active: true 
    };

    if (temporadaAEditar) {
      updateMutation.mutate(
        { id: temporadaAEditar.id, data },
        {
          onSuccess: () => {
            toast.success("¡Temporada Actualizada!");
            limpiarFormulario();
            onTemporadaCreated();
          },
          onError: (error: Error) => {
            toast.error("Error al guardar", { description: error.message || "Error al actualizar la temporada" });
          }
        }
      );
    } else {
      createMutation.mutate(
        data,
        {
          onSuccess: () => {
            toast.success("¡Temporada Creada!");
            limpiarFormulario();
            onTemporadaCreated();
          },
          onError: (error: Error) => {
            toast.error("Error al guardar", { description: error.message || "Error al crear la temporada" });
          }
        }
      );
    }
  };

  return (
    <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs h-fit relative">
      {/* Si estamos editando, muestra un botón chiquito para cancelar y volver a crear */}
      {temporadaAEditar && (
        <button 
          onClick={limpiarFormulario}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 p-1 rounded-full bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer"
          title="Cancelar edición"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <div className="flex items-center gap-2 text-brand-blue text-xs font-extrabold tracking-widest uppercase mb-4">
        <TrendingUp className="h-4 w-4" />
        {temporadaAEditar ? "Editar Rango" : "Configurar Rango"}
      </div>

      <form onSubmit={handleSaveTemporada} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-dark-primary">Identificador (Nombre)</label>
          <Input type="text" placeholder="Ej. Semana Santa 2026" value={nombre} onChange={(e) => setNombre(e.target.value)} className="bg-white border-zinc-200 rounded-xl text-xs h-10" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-dark-primary">Impacto Tarifario (%)</label>
          <Input 
            type="number" 
            placeholder="Ej: 25 (Sube tarifa) o -15 (Descuento)" 
            value={porcentaje} 
            onChange={(e) => setPorcentaje(e.target.value)} 
            className="bg-white border-zinc-200 rounded-xl text-xs h-10" 
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-dark-primary">Fecha Desde</label>
          <Input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="bg-white border-zinc-200 rounded-xl text-xs h-10" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-dark-primary">Fecha Hasta</label>
          <Input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="bg-white border-zinc-200 rounded-xl text-xs h-10" />
        </div>

        {/* El botón cambia dinámicamente de color y texto si es creación o edición */}
        <Button 
          type="submit" 
          disabled={isPending} 
          className={`mt-2 h-11 w-full text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
            temporadaAEditar 
              ? "bg-blue-600 hover:bg-blue-700 shadow-blue-600/15" 
              : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/15"
          }`}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : temporadaAEditar ? (
            <Save className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {temporadaAEditar ? "Guardar Cambios" : "Registrar Temporada"}
        </Button>
      </form>
    </div>
  );
}