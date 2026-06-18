"use client";

import { useState } from "react";
import {
  Calendar,
  Loader2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreateTemporadaDialog } from "../create-temporada-dialog";
import { useGetTemporadasQuery } from "@/modules/temporada/domain/hooks/useTemporadaQueries";
import { useDeleteTemporadaMutation } from "@/modules/temporada/domain/hooks/useTemporadaMutations";
import { Temporada } from "@/core/temporada/interfaces";

export function TemporadasDashboardView() {
  const { data: temporadas = [], isLoading, refetch } = useGetTemporadasQuery();
  const deleteMutation = useDeleteTemporadaMutation();

  const [temporadaAEditar, setTemporadaAEditar] = useState<Temporada | null>(
    null,
  );

  const handleDeleteTemporada = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Temporada removida del sistema");
        // Si justo estábamos editando la que se borró, limpiamos el formulario
        if (temporadaAEditar?.id === id) setTemporadaAEditar(null);
      },
      onError: (error) => {
        toast.error(
          error.message || "No se pudo eliminar la temporada seleccionada",
        );
      },
    });
  };

  if (isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-1">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-dark-primary">
            Mantenimiento de Temporadas
          </h2>
          <p className="text-dark-secondary text-sm">
            Controla las fechas del calendario anual y los incrementos
            inteligentes de tarifas.
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          variant="outline"
          className="h-11 px-4 border-zinc-200 bg-white text-zinc-700 font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          Sincronizar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 🔥 PASAMOS LA DATA Y EL MODIFICADOR AL DIALOGO/FORMULARIO CON KEY PARA FORZAR RESET */}
        <CreateTemporadaDialog
          key={temporadaAEditar?.id || "new"}
          onTemporadaCreated={refetch}
          temporadaAEditar={temporadaAEditar}
          setTemporadaAEditar={setTemporadaAEditar}
        />

        <div className="lg:col-span-2 bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 text-zinc-500 text-xs font-extrabold tracking-widest uppercase mb-4">
            <Calendar className="h-4 w-4" />
            Línea de Tiempo del Tarifario
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-zinc-100 text-[10px] font-bold text-dark-secondary/80 tracking-widest uppercase">
                  <th className="pb-4">Descripción</th>
                  <th className="pb-4">Vigencia Calendario</th>
                  <th className="pb-4">Impacto</th>
                  <th className="pb-4">Estado</th>
                  <th className="pb-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {temporadas.length > 0 ? (
                  temporadas.map((temp: Temporada) => {
                    const valorPorcentaje =
                      temp.porcentaje !== undefined ? temp.porcentaje : 0;

                    return (
                      <tr
                        key={temp.id}
                        className="border-b border-zinc-50 hover:bg-zinc-50/20 transition-colors"
                      >
                        <td className="py-4">
                          <span className="text-xs font-bold text-dark-primary">
                            {temp.nombre}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className="text-xs font-semibold text-dark-secondary">
                            {temp.fecha_inicio_formateada} -{" "}
                            {temp.fecha_fin_formateada}
                          </span>
                        </td>
                        <td className="py-4">
                          <span
                            className={`text-xs font-extrabold ${valorPorcentaje > 0 ? "text-emerald-600" : valorPorcentaje < 0 ? "text-blue-600" : "text-zinc-500"}`}
                          >
                            {valorPorcentaje > 0
                              ? `+${valorPorcentaje}%`
                              : `${valorPorcentaje}%`}
                          </span>
                        </td>
                        <td className="py-4">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-1 rounded-full ${temp.is_active ? "bg-emerald-50 text-emerald-600" : "bg-zinc-100 text-zinc-500"}`}
                          >
                            {temp.is_active ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            {temp.estado_label}
                          </span>
                        </td>
                        <td className="py-4 text-right flex items-center justify-end gap-2">
                          {/* 🔥 NUEVO BOTÓN DE EDITAR: Carga la temporada en el formulario de la izquierda */}
                          <button
                            onClick={() => setTemporadaAEditar(temp)}
                            className="text-xs font-bold text-brand-blue hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="h-3.5 w-3.5" /> Editar
                          </button>

                          <button
                            onClick={() => handleDeleteTemporada(temp.id)}
                            className="text-xs font-bold text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Remover
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-xs text-dark-secondary"
                    >
                      No se registran temporadas dinámicas configuradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
