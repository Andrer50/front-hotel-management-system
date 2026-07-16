"use client";

import { Plus, Loader2, TrendingUp, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
<<<<<<< HEAD
import { useState, useEffect } from "react";
=======
import { useState } from "react";
import { 
  useCreateTemporadaMutation, 
  useUpdateTemporadaMutation 
} from "@/modules/temporada/domain/hooks/useTemporadaMutations";
import { Temporada } from "@/core/temporada/interfaces";
>>>>>>> 323b050b17b38e5f9eeb0428724e943582dd5db6

// 🚀 CAMBIO CLAVE: Importamos el nuevo hook modular de mutaciones
import { useTemporadasMutations } from "@/modules/temporadas/hooks/useTemporadasMutations";
import { updateTemporadaAction } from "@/core/temporadas/actions/temporadasActions";

interface CreateTemporadaDialogProps {
  onTemporadaCreated: () => void;
<<<<<<< HEAD
  temporadaAEditar: any | null;       
  setTemporadaAEditar: (val: any | null) => void; 
=======
  temporadaAEditar: Temporada | null;       // ← Recibe la temporada seleccionada
  setTemporadaAEditar: (val: Temporada | null) => void; // ← Función para limpiar estado
>>>>>>> 323b050b17b38e5f9eeb0428724e943582dd5db6
}

export function CreateTemporadaDialog({ 
  onTemporadaCreated, 
  temporadaAEditar, 
  setTemporadaAEditar 
}: CreateTemporadaDialogProps) {
<<<<<<< HEAD
  const [nombre, setNombre] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [porcentaje, setPorcentaje] = useState("");

  // 📈 JALAMOS EL HOOK DE MUTACIONES (Renombramos isSubmitting a loading para no romper el HTML de abajo)
  const { crearTemporada, isSubmitting: loading } = useTemporadasMutations();

  useEffect(() => {
    if (temporadaAEditar) {
      setNombre(temporadaAEditar.nombre || "");
      setFechaInicio(temporadaAEditar.fecha_inicio || "");
      setFechaFin(temporadaAEditar.fecha_fin || "");
      setPorcentaje(temporadaAEditar.porcentaje !== undefined ? temporadaAEditar.porcentaje.toString() : "");
    } else {
      limpiarFormulario();
    }
  }, [temporadaAEditar]);
=======
  const createMutation = useCreateTemporadaMutation();
  const updateMutation = useUpdateTemporadaMutation();

  const [nombre, setNombre] = useState(temporadaAEditar?.nombre || "");
  const [fechaInicio, setFechaInicio] = useState(temporadaAEditar?.fecha_inicio || "");
  const [fechaFin, setFechaFin] = useState(temporadaAEditar?.fecha_fin || "");
  const [porcentaje, setPorcentaje] = useState(
    temporadaAEditar?.porcentaje !== undefined ? temporadaAEditar.porcentaje.toString() : ""
  );

  const isPending = createMutation.isPending || updateMutation.isPending;
>>>>>>> 323b050b17b38e5f9eeb0428724e943582dd5db6

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

<<<<<<< HEAD
    const esEdicion = !!temporadaAEditar;
    const payload = { 
      nombre, 
      fecha_inicio: fechaInicio, 
      fecha_fin: fechaFin, 
      porcentaje: parseInt(porcentaje), 
      is_active: true 
    };

    try {
      let response: any;

      if (esEdicion) {
        response = await updateTemporadaAction(temporadaAEditar.id, payload);
      } else {
        response = await crearTemporada(payload);
      }

      // Validamos el éxito de la operación en base a la respuesta de Django o Axios
      const esExitoso = response && (response.status === "success" || response.id || response.data?.status === "success");

      if (esExitoso) {
        toast.success(esEdicion ? "¡Temporada Actualizada!" : "¡Temporada Creada!");
        limpiarFormulario();
        onTemporadaCreated();
      } else {
        toast.error("Error al guardar la temporada");
      }
    } catch (error) {
      console.error("Error guardando temporada:", error);
      toast.error("Error de conexión con el servidor");
=======
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
>>>>>>> 323b050b17b38e5f9eeb0428724e943582dd5db6
    }
  };

  return (
    <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs h-fit relative">
      {temporadaAEditar && (
        <button 
          type="button"
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

        <Button 
          type="submit" 
<<<<<<< HEAD
          disabled={loading} 
=======
          disabled={isPending} 
>>>>>>> 323b050b17b38e5f9eeb0428724e943582dd5db6
          className={`mt-2 h-11 w-full text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
            temporadaAEditar 
              ? "bg-blue-600 hover:bg-blue-700 shadow-blue-600/15" 
              : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/15"
          }`}
        >
<<<<<<< HEAD
          {loading ? (
=======
          {isPending ? (
>>>>>>> 323b050b17b38e5f9eeb0428724e943582dd5db6
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