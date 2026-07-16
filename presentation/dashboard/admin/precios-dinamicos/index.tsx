"use client";

import { useState, useCallback } from "react";
import {
  useGetDynamicPricingAnalysisMutation,
  useApplyPricingMutation,
} from "@/modules/pricing/domain/hooks/usePricingMutations";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  TrendingUp,
  Sparkles,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Loader2,
  Sliders,
  Calendar,
  Activity,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { DynamicPricingAnalysisResponse } from "@/core/pricing/interfaces";

export function PreciosDinamicosView() {
  // Estado para la simulación
  const [ocupacionSimulada, setOcupacionSimulada] = useState<number>(65);
  const [compIndividual, setCompIndividual] = useState<number>(130);
  const [compDoble, setCompDoble] = useState<number>(200);
  const [compSuite, setCompSuite] = useState<number>(380);
  const [compFamiliar, setCompFamiliar] = useState<number>(280);
  const [temporadaSimulada, setTemporadaSimulada] = useState<string>("");

  // Mutaciones
  const { mutate: analyze, isPending: isAnalyzing } = useGetDynamicPricingAnalysisMutation();
  const applyMutation = useApplyPricingMutation();

  // Guardar los resultados del análisis
  const [analysisResult, setAnalysisResult] =
    useState<DynamicPricingAnalysisResponse | null>(null);

  // Cargar análisis con valores reales de forma estable
  const loadRealAnalysis = useCallback(() => {
    analyze(
      {},
      {
        onSuccess: (data) => {
          setAnalysisResult(data);
          // Si cargamos valores reales, sincronizar los sliders del simulador
          setOcupacionSimulada(Math.round(data.meta.tasa_ocupacion_real));
          toast.success("Análisis de mercado cargado con datos reales.");
        },
        onError: (error) => {
          toast.error(
            error.message || "Error al calcular precios dinámicos con IA.",
          );
        },
      },
    );
  }, [analyze]);

  // Ejecutar la simulación con los valores ingresados por el usuario
  const handleRunSimulation = useCallback(() => {
    const payload = {
      ocupacion_simulada: ocupacionSimulada,
      competidores: {
        INDIVIDUAL: compIndividual,
        DOBLE: compDoble,
        SUITE: compSuite,
        FAMILIAR: compFamiliar,
      },
      temporada_simulada: temporadaSimulada.trim() || undefined,
    };

    analyze(payload, {
      onSuccess: (data) => {
        setAnalysisResult(data);
        toast.success("Simulación de mercado ejecutada exitosamente.");
      },
      onError: (error) => {
        toast.error(
          error.message || "Error al calcular precios dinámicos con IA.",
        );
      },
    });
  }, [
    ocupacionSimulada,
    compIndividual,
    compDoble,
    compSuite,
    compFamiliar,
    temporadaSimulada,
    analyze,
  ]);

  const handleApplySinglePrice = (tipo: string, precio: number) => {
    applyMutation.mutate(
      { precios: { [tipo]: precio } },
      {
        onSuccess: () => {
          toast.success(
            `Tarifa para habitación ${tipo} actualizada a S/. ${precio.toFixed(2)}`,
          );
          // Actualizar el estado local para reflejar que ahora es la tarifa actual
          if (analysisResult) {
            const updatedRecs = analysisResult.recomendaciones.map((rec) => {
              if (rec.habitacion_tipo === tipo) {
                return {
                  ...rec,
                  precio_base_actual: precio,
                  porcentaje_cambio: 0,
                };
              }
              return rec;
            });
            setAnalysisResult({
              ...analysisResult,
              recomendaciones: updatedRecs,
            });
          }
        },
        onError: (error) => {
          toast.error(
            error.message || "No se pudo aplicar la tarifa sugerida.",
          );
        },
      },
    );
  };

  const handleApplyAllPrices = () => {
    if (!analysisResult) return;

    const preciosPayload: Record<string, number> = {};
    analysisResult.recomendaciones.forEach((rec) => {
      preciosPayload[rec.habitacion_tipo] = rec.precio_dinamico_sugerido;
    });

    applyMutation.mutate(
      { precios: preciosPayload },
      {
        onSuccess: () => {
          toast.success(
            "Se han actualizado todas las tarifas base del hotel satisfactoriamente.",
          );
          // Resetear a actualizados localmente
          const updatedRecs = analysisResult.recomendaciones.map((rec) => ({
            ...rec,
            precio_base_actual: rec.precio_dinamico_sugerido,
            porcentaje_cambio: 0,
          }));
          setAnalysisResult({
            ...analysisResult,
            recomendaciones: updatedRecs,
          });
        },
        onError: (error) => {
          toast.error(
            error.message || "No se pudieron aplicar las tarifas sugeridas.",
          );
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-12">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-1">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-dark-primary flex items-center gap-2.5">
            <TrendingUp className="h-8 w-8 text-brand-blue" />
            Estrategia de Precios Dinámicos
          </h2>
          <p className="text-dark-secondary text-sm">
            Optimiza tarifas en tiempo real usando Inteligencia Artificial
            basada en ocupación, competencia y temporadas.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={loadRealAnalysis}
            variant="outline"
            className="h-11 px-4 border-zinc-200 bg-white text-zinc-700 font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs cursor-pointer hover:bg-zinc-50"
            disabled={isAnalyzing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isAnalyzing && !analysisResult?.meta.es_simulacion ? "animate-spin" : ""}`}
            />
            Sincronizar Reales
          </Button>

          <Button
            onClick={handleRunSimulation}
            className="h-11 px-5 bg-gradient-to-r from-brand-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-brand-blue/15 cursor-pointer border-0"
            disabled={isAnalyzing}
          >
            <Sparkles className="h-4 w-4 animate-pulse" />
            Analizar con IA
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Panel del Simulador (Izquierda: 4/12) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="border border-zinc-100 shadow-xs rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-zinc-50/50 border-b border-zinc-100/50 p-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-brand-blue/10 text-brand-blue rounded-xl">
                  <Sliders className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-md font-bold text-dark-primary">
                    Simulador de Escenarios
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Varía los parámetros del mercado para probar la IA.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 flex flex-col gap-5">
              {/* Ocupación */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-bold text-dark-secondary">
                  <Label
                    htmlFor="range-ocupacion"
                    className="flex items-center gap-1.5 cursor-pointer"
                  >
                    <Activity className="h-3.5 w-3.5 text-zinc-400" />
                    Ocupación Simulada
                  </Label>
                  <Badge
                    variant="secondary"
                    className="bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/10 font-extrabold text-[11px] rounded-lg px-2 py-0.5 border-0"
                  >
                    {ocupacionSimulada}%
                  </Badge>
                </div>
                <input
                  id="range-ocupacion"
                  type="range"
                  min="0"
                  max="100"
                  value={ocupacionSimulada}
                  onChange={(e) => setOcupacionSimulada(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-brand-blue"
                />
                <span className="text-[10px] text-zinc-400 font-medium">
                  {ocupacionSimulada < 30
                    ? "Ocupación baja (descuentos agresivos)"
                    : ocupacionSimulada > 80
                      ? "Alta ocupación (tarifas premium)"
                      : "Ocupación media (tarifas estándar)"}
                </span>
              </div>

              {/* Temporada Especial */}
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="input-temporada"
                  className="text-xs font-bold text-dark-secondary flex items-center gap-1.5"
                >
                  <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                  Temporada / Evento Especial
                </Label>
                <Input
                  id="input-temporada"
                  placeholder="Ej. Año Nuevo, Baja, Semana Santa"
                  value={temporadaSimulada}
                  onChange={(e) => setTemporadaSimulada(e.target.value)}
                  className="h-10 rounded-xl border-zinc-200 text-xs px-3 focus-visible:ring-brand-blue"
                />
              </div>

              <div className="h-px bg-zinc-100 my-1" />

              {/* Competencia */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-bold text-dark-primary flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-zinc-400" />
                  Precios de Competidores (S/.)
                </span>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <Label
                      htmlFor="comp-ind"
                      className="text-[10px] font-bold text-dark-secondary uppercase tracking-wider"
                    >
                      Individual
                    </Label>
                    <Input
                      id="comp-ind"
                      type="number"
                      value={compIndividual}
                      onChange={(e) =>
                        setCompIndividual(Number(e.target.value))
                      }
                      className="h-9 rounded-lg border-zinc-200 text-xs px-2.5"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label
                      htmlFor="comp-doble"
                      className="text-[10px] font-bold text-dark-secondary uppercase tracking-wider"
                    >
                      Doble
                    </Label>
                    <Input
                      id="comp-doble"
                      type="number"
                      value={compDoble}
                      onChange={(e) => setCompDoble(Number(e.target.value))}
                      className="h-9 rounded-lg border-zinc-200 text-xs px-2.5"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label
                      htmlFor="comp-suite"
                      className="text-[10px] font-bold text-dark-secondary uppercase tracking-wider"
                    >
                      Suite
                    </Label>
                    <Input
                      id="comp-suite"
                      type="number"
                      value={compSuite}
                      onChange={(e) => setCompSuite(Number(e.target.value))}
                      className="h-9 rounded-lg border-zinc-200 text-xs px-2.5"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label
                      htmlFor="comp-familiar"
                      className="text-[10px] font-bold text-dark-secondary uppercase tracking-wider"
                    >
                      Familiar
                    </Label>
                    <Input
                      id="comp-familiar"
                      type="number"
                      value={compFamiliar}
                      onChange={(e) => setCompFamiliar(Number(e.target.value))}
                      className="h-9 rounded-lg border-zinc-200 text-xs px-2.5"
                    />
                  </div>
                </div>
              </div>

              {/* Botón Simular */}
              <Button
                onClick={handleRunSimulation}
                className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 mt-2 cursor-pointer shadow-xs border-0"
                disabled={isAnalyzing}
              >
                {isAnalyzing &&
                analysisResult?.meta.es_simulacion ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Simulando Escenario...
                  </>
                ) : (
                  <>
                    <Sliders className="h-4 w-4" />
                    Simular Escenario
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Panel de Resultados (Derecha: 8/12) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {isAnalyzing && !analysisResult ? (
            /* Loader Principal al Cargar Primera Vez */
            <div className="bg-white border border-zinc-100 rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-xs min-h-[400px]">
              <Loader2 className="h-10 w-10 animate-spin text-brand-blue mb-4" />
              <h3 className="font-bold text-lg text-dark-primary">
                Analizando con Asturias AI...
              </h3>
              <p className="text-dark-secondary text-sm max-w-sm mt-1">
                Estamos procesando la ocupación en tiempo real y evaluando la
                competencia para calcular las tarifas óptimas.
              </p>
            </div>
          ) : !analysisResult ? (
            /* Estado Inicial */
            <div className="bg-white border border-zinc-100 rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-xs min-h-[400px]">
              <Sparkles className="h-12 w-12 text-zinc-300 mb-4" />
              <h3 className="font-bold text-lg text-dark-primary">
                Sin Análisis Activo
              </h3>
              <p className="text-dark-secondary text-sm max-w-sm mt-1">
                Presiona &quot;Analizar con IA&quot; o &quot;Sincronizar
                Reales&quot; para generar las primeras sugerencias de tarifas.
              </p>
            </div>
          ) : (
            /* Resultados de Análisis */
            <div className="flex flex-col gap-6">
              {/* Resumen del Análisis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Estado Analizado */}
                <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
                  <span className="text-[10px] font-bold text-dark-secondary tracking-widest uppercase mb-2">
                    Datos del Análisis
                  </span>

                  <div className="flex flex-wrap items-center gap-3">
                    <Badge
                      className={`font-extrabold text-[11px] px-2.5 py-1 rounded-full border-0 ${analysisResult.meta.es_simulacion ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}
                    >
                      {analysisResult.meta.es_simulacion
                        ? "Escenario Simulado"
                        : "Valores en Tiempo Real"}
                    </Badge>
                    <div className="flex items-center text-xs font-bold text-dark-primary">
                      Ocupación:{" "}
                      <span className="text-brand-blue ml-1 font-extrabold">
                        {analysisResult.meta.tasa_ocupacion_analizada}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info Competencia */}
                <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[100px]">
                  <span className="text-[10px] font-bold text-dark-secondary tracking-widest uppercase mb-2">
                    Objetivo de Ingresos
                  </span>
                  <div className="text-xs font-semibold text-dark-secondary leading-relaxed">
                    Las sugerencias buscan un balance entre{" "}
                    <strong className="text-dark-primary font-bold">
                      maximizar la ocupación
                    </strong>{" "}
                    y{" "}
                    <strong className="text-dark-primary font-bold">
                      capturar rentabilidad
                    </strong>{" "}
                    según la estacionalidad del mercado.
                  </div>
                </div>
              </div>

              {/* Insights de Mercado (Caja Glassmorphism / Destacada) */}
              <Card className="border-l-4 border-l-brand-blue bg-blue-50/20 border-zinc-100 shadow-xs rounded-2xl p-6">
                <div className="flex gap-4">
                  <div className="p-2.5 bg-brand-blue/10 text-brand-blue rounded-xl h-fit">
                    <Sparkles className="h-5 w-5 animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-extrabold text-sm text-brand-blue tracking-wide uppercase mb-1">
                      Perspectiva de la Inteligencia Artificial (Asturias AI)
                    </h4>
                    <p className="text-dark-primary text-xs leading-relaxed font-medium">
                      {analysisResult.insights_mercado}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Listado de Habitaciones con Tarifas */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center px-1">
                  <h3 className="font-extrabold text-sm text-dark-secondary tracking-wider uppercase">
                    Recomendaciones por Categoría
                  </h3>

                  {analysisResult.recomendaciones.some(
                    (rec) => rec.porcentaje_cambio !== 0,
                  ) && (
                    <Button
                      onClick={handleApplyAllPrices}
                      disabled={applyMutation.isPending}
                      className="h-8 px-3 bg-brand-blue hover:bg-blue-600 text-white font-bold text-[11px] rounded-lg flex items-center gap-1 cursor-pointer border-0"
                    >
                      {applyMutation.isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      )}
                      Aplicar Todas
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysisResult.recomendaciones.map((rec) => {
                    const isIncrease = rec.porcentaje_cambio > 0;
                    const isDecrease = rec.porcentaje_cambio < 0;
                    const hasChange = rec.porcentaje_cambio !== 0;

                    return (
                      <Card
                        key={rec.habitacion_tipo}
                        className={`border rounded-2xl p-5 shadow-xs bg-white transition-all duration-300 hover:shadow-md ${hasChange ? "border-zinc-100" : "border-emerald-100 bg-emerald-50/5"}`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="text-[10px] font-extrabold text-zinc-400 tracking-wider uppercase">
                              Categoría Habitación
                            </span>
                            <h4 className="font-bold text-base text-dark-primary">
                              {rec.habitacion_tipo}
                            </h4>
                          </div>

                          {hasChange ? (
                            <Badge
                              className={`font-extrabold text-[10px] border-0 px-2 py-0.5 rounded-md ${isIncrease ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}
                            >
                              {isIncrease ? (
                                <span className="flex items-center gap-0.5">
                                  <ArrowUpRight className="h-3 w-3" />+
                                  {rec.porcentaje_cambio}%
                                </span>
                              ) : (
                                <span className="flex items-center gap-0.5">
                                  <ArrowDownRight className="h-3 w-3" />
                                  {rec.porcentaje_cambio}%
                                </span>
                              )}
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-50 text-emerald-600 border-0 font-extrabold text-[10px] px-2 py-0.5 rounded-md">
                              Tarifa Óptima
                            </Badge>
                          )}
                        </div>

                        {/* Comparación Tarifas */}
                        <div className="flex items-center gap-6 mb-4 bg-zinc-50/50 border border-zinc-100/50 p-3 rounded-xl">
                          <div>
                            <span className="text-[9px] font-bold text-dark-secondary uppercase tracking-wider">
                              Actual Base
                            </span>
                            <div className="text-sm font-extrabold text-zinc-500">
                              S/. {rec.precio_base_actual.toFixed(2)}
                            </div>
                          </div>

                          <ArrowRight className="h-4 w-4 text-zinc-300" />

                          <div>
                            <span className="text-[9px] font-bold text-brand-blue uppercase tracking-wider">
                              Sugerido IA
                            </span>
                            <div className="text-sm font-black text-brand-blue">
                              S/. {rec.precio_dinamico_sugerido.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {/* Justificación */}
                        <p className="text-xs text-dark-secondary leading-relaxed font-medium mb-5 min-h-[50px]">
                          {rec.justificacion}
                        </p>

                        {/* Botón Aplicar */}
                        {hasChange ? (
                          <Button
                            onClick={() =>
                              handleApplySinglePrice(
                                rec.habitacion_tipo,
                                rec.precio_dinamico_sugerido,
                              )
                            }
                            disabled={applyMutation.isPending}
                            className="w-full h-9 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 border border-zinc-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            {applyMutation.isPending ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-3.5 w-3.5 text-brand-blue" />
                            )}
                            Aplicar Tarifa
                          </Button>
                        ) : (
                          <div className="h-9 w-full rounded-xl border border-dashed border-emerald-200 bg-emerald-50/10 flex items-center justify-center gap-1.5 text-emerald-600 text-xs font-bold">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            Tarifa Aplicada
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
