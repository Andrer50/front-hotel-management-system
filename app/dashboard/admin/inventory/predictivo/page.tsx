"use client";

import { useMemo, useState } from "react";
import {
  Package,
  AlertTriangle,
  ShoppingCart,
  TrendingDown,
  Search,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetInventarioPredictivoQuery } from "@/modules/inventory/domain/hooks/useInventarioQueries";

export default function PredictiveInventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: predicciones = [], isLoading } = useGetInventarioPredictivoQuery();

  const filteredPredictions = useMemo(() => {
    return predicciones.filter((item) => {
      const q = searchQuery.toLowerCase();
      return (
        item.nombre.toLowerCase().includes(q) ||
        (item.descripcion || "").toLowerCase().includes(q) ||
        (item.sede || "").toLowerCase().includes(q)
      );
    });
  }, [predicciones, searchQuery]);

  const stats = useMemo(() => {
    const totalEnRiesgo = filteredPredictions.filter(
      (item) => item.projected_stock < 0 || item.stock_actual <= item.stock_minimo
    ).length;

    const totalPedidosSugeridos = filteredPredictions.reduce(
      (acc, item) => acc + item.suggested_order,
      0
    );

    const promedioStockProyectado = filteredPredictions.length
      ? filteredPredictions.reduce((acc, item) => acc + item.projected_stock, 0) /
        filteredPredictions.length
      : 0;

    return {
      totalEnRiesgo,
      totalPedidosSugeridos,
      promedioStockProyectado: Math.round(promedioStockProyectado),
    };
  }, [filteredPredictions]);

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Header and Back navigation */}
      <div className="flex flex-col gap-4">
        <Link href="/dashboard/admin/inventory">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 hover:bg-zinc-50 border border-zinc-100 text-dark-secondary hover:text-dark-primary rounded-xl px-3 py-1.5 cursor-pointer text-xs font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Inventario
          </Button>
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-dark-primary">
              Inventario Predictivo y Alertas
            </h2>
            <p className="text-dark-secondary text-sm max-w-2xl leading-relaxed">
              Consumo estimado según reservas de los próximos 15 días y consumo promedio simulado de los últimos 30 días.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div
          className={`border rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-[115px] transition-all ${
            stats.totalEnRiesgo > 0
              ? "bg-red-50/50 border-red-100 text-red-600"
              : "bg-white border-zinc-100 text-dark-primary"
          }`}
        >
          <span className="text-[10px] font-extrabold tracking-widest uppercase opacity-80">
            Artículos en Riesgo de Desabastecimiento
          </span>
          <div className="flex items-end justify-between mt-2">
            {isLoading ? (
              <Skeleton className="h-9 w-12" />
            ) : (
              <span className={`text-3xl font-extrabold tracking-tight`}>
                {stats.totalEnRiesgo}
              </span>
            )}
            <span
              className={`p-1.5 rounded-lg ${
                stats.totalEnRiesgo > 0 ? "bg-red-100/50 text-red-500" : "bg-zinc-50 text-dark-secondary"
              }`}
            >
              <AlertTriangle className="h-4.5 w-4.5" />
            </span>
          </div>
        </div>

        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-[115px]">
          <span className="text-[10px] font-extrabold text-dark-secondary/80 tracking-widest uppercase">
            Sugerencia Total de Pedido (Unidades)
          </span>
          <div className="flex items-end justify-between mt-2">
            {isLoading ? (
              <Skeleton className="h-9 w-20" />
            ) : (
              <span className="text-3xl font-extrabold text-brand-blue tracking-tight">
                {stats.totalPedidosSugeridos.toLocaleString()}
              </span>
            )}
            <span className="bg-blue-50 text-brand-blue p-1.5 rounded-lg">
              <ShoppingCart className="h-4.5 w-4.5" />
            </span>
          </div>
        </div>

        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-[115px]">
          <span className="text-[10px] font-extrabold text-dark-secondary/80 tracking-widest uppercase">
            Stock Proyectado Promedio
          </span>
          <div className="flex items-end justify-between mt-2">
            {isLoading ? (
              <Skeleton className="h-9 w-24" />
            ) : (
              <span className="text-3xl font-extrabold text-dark-primary tracking-tight">
                {stats.promedioStockProyectado.toLocaleString()}
              </span>
            )}
            <span className="bg-zinc-50 text-dark-secondary p-1.5 rounded-lg">
              <TrendingDown className="h-4.5 w-4.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Filter search bar */}
      <div className="flex justify-end items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-dark-secondary/60" />
          <Input
            type="text"
            placeholder="Buscar producto, descripción o sede..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 bg-white border-zinc-200 rounded-xl text-xs h-10 shadow-2xs focus:border-brand-blue/30"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="border-b border-zinc-100 text-[10px] font-bold text-dark-secondary/80 tracking-widest uppercase pb-4">
                <th className="pb-4 font-bold text-left">Producto / Sede</th>
                <th className="pb-4 font-bold text-left">Stock Actual</th>
                <th className="pb-4 font-bold text-left">Stock Ideal</th>
                <th className="pb-4 font-bold text-left">Consumo Proyectado</th>
                <th className="pb-4 font-bold text-left">Stock Proyectado</th>
                <th className="pb-4 font-bold text-left">F. Est. Desabastecimiento</th>
                <th className="pb-4 font-bold text-right">Pedido Sugerido</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-zinc-50">
                    <td colSpan={7} className="py-4">
                      <Skeleton className="h-10 w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredPredictions.length > 0 ? (
                filteredPredictions.map((item) => {
                  const isCritical = item.projected_stock < 0;
                  const isWarning = !isCritical && item.projected_stock <= item.stock_minimo;
                  
                  let rowBg = "border-b border-zinc-50 hover:bg-zinc-50/20 last:border-0 transition-colors";
                  if (isCritical) {
                    rowBg = "border-b border-red-50 bg-red-50/10 hover:bg-red-50/20 last:border-0 transition-colors text-red-900";
                  } else if (isWarning) {
                    rowBg = "border-b border-amber-50 bg-amber-50/10 hover:bg-amber-50/20 last:border-0 transition-colors text-amber-900";
                  }

                  return (
                    <tr key={item.id} className={rowBg}>
                      <td className="py-4.5 pr-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-xl border flex items-center justify-center font-bold text-xs shadow-2xs shrink-0 ${
                            isCritical 
                              ? "bg-red-50 border-red-100 text-red-500" 
                              : isWarning 
                              ? "bg-amber-50 border-amber-100 text-amber-500" 
                              : "bg-zinc-50 border-zinc-100 text-zinc-400"
                          }`}>
                            <Package className="h-4.5 w-4.5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold leading-tight">
                              {item.nombre}
                            </span>
                            <span className="text-[10px] font-semibold text-dark-secondary/70 mt-0.5 line-clamp-1">
                              Sede: {item.sede} {item.descripcion ? `| ${item.descripcion}` : ""}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4.5 pr-4 text-xs font-bold text-dark-secondary">
                        {item.stock_actual}
                      </td>

                      <td className="py-4.5 pr-4 text-xs font-bold text-dark-secondary">
                        {item.stock_ideal}
                      </td>

                      <td className="py-4.5 pr-4 text-xs font-bold text-dark-secondary">
                        {item.projected_consumption}
                      </td>

                      <td className="py-4.5 pr-4">
                        <span className={`text-xs font-extrabold px-2 py-0.5 rounded ${
                          isCritical
                            ? "bg-red-100 text-red-700"
                            : isWarning
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}>
                          {item.projected_stock}
                        </span>
                      </td>

                      <td className="py-4.5 pr-4 text-xs font-bold">
                        {isCritical ? (
                          <span className="inline-flex items-center gap-1 text-red-600 bg-red-100/50 px-2 py-0.5 rounded text-[10px] font-extrabold animate-pulse">
                            <Calendar className="h-3 w-3" />
                            {item.estimated_stockout_date}
                          </span>
                        ) : isWarning ? (
                          <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-100/50 px-2 py-0.5 rounded text-[10px] font-extrabold">
                            <Calendar className="h-3 w-3" />
                            {item.estimated_stockout_date}
                          </span>
                        ) : (
                          <span className="text-dark-secondary/70">
                            {item.estimated_stockout_date}
                          </span>
                        )}
                      </td>

                      <td className="py-4.5 text-right text-xs font-extrabold text-dark-primary">
                        {item.suggested_order > 0 ? (
                          <span className="inline-flex items-center gap-1 text-brand-blue bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-xl">
                            {item.suggested_order}
                          </span>
                        ) : (
                          <span className="text-zinc-300">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs font-semibold text-dark-secondary">
                    No se encontraron predicciones de inventario.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
