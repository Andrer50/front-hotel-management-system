"use client";

import { Plus, Loader2, TrendingUp, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSession } from "next-auth/react"; 
import { useState, useEffect } from "react";

interface CreateTemporadaDialogProps {
  onTemporadaCreated: () => void;
  temporadaAEditar: any | null;       // ← Recibe la temporada seleccionada
  setTemporadaAEditar: (val: any | null) => void; // ← Función para limpiar estado
}

export function CreateTemporadaDialog({ 
  onTemporadaCreated, 
  temporadaAEditar, 
  setTemporadaAEditar 
}: CreateTemporadaDialogProps) {
  const { data: session }: any = useSession(); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nombre, setNombre] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [porcentaje, setPorcentaje] = useState("");

  // 🔥 EFECTO SENSOR: Si el admin hace clic en "Editar", autollena el formulario al toque
  useEffect(() => {
    if (temporadaAEditar) {
      setNombre(temporadaAEditar.nombre || "");
      setFechaInicio(temporadaAEditar.fecha_inicio || "");
      setFechaFin(temporadaAEditar.fecha_fin || "");
      setPorcentaje(temporadaAEditar.porcentaje !== undefined ? temporadaAEditar.porcentaje.toString() : "");
    } else {
      // Si se limpia, vacía el formulario
      limpiarFormulario();
    }
  }, [temporadaAEditar]);

  const limpiarFormulario = () => {
    setNombre("");
    setFechaInicio("");
    setFechaFin("");
    setPorcentaje("");
    setTemporadaAEditar(null);
  };

  const handleSaveTemporada = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre || !fechaInicio || !fechaFin || !porcentaje) {
      toast.warning("Campos incompletos", { description: "Por favor llena todos los datos obligatorios." });
      return;
    }

    setIsSubmitting(true);
    const token = session?.accessToken || session?.user?.token || session?.token;

    // Definiendo si es una actualización (PUT) o una creación nueva (POST)
    const esEdicion = !!temporadaAEditar;
    const url = esEdicion 
      ? `http://localhost:8000/api/hotel/temporadas/${temporadaAEditar.id}` 
      : "http://localhost:8000/api/hotel/temporadas";
    const metodo = esEdicion ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          nombre, 
          fecha_inicio: fechaInicio, 
          fecha_fin: fechaFin, 
          porcentaje: parseInt(porcentaje), 
          is_active: true 
        }),
      });

      const resData = await response.json();
      if (response.ok) {
        toast.success(esEdicion ? "¡Temporada Actualizada!" : "¡Temporada Creada!");
        limpiarFormulario();
        onTemporadaCreated();
      } else {
        toast.error("Error al guardar", { description: resData.message });
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor");
    } finally {
      setIsSubmitting(false);
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
          disabled={isSubmitting} 
          className={`mt-2 h-11 w-full text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
            temporadaAEditar 
              ? "bg-blue-600 hover:bg-blue-700 shadow-blue-600/15" 
              : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/15"
          }`}
        >
          {isSubmitting ? (
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