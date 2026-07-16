"use client";

import { useMemo, useState } from "react";
import {
  Package,
  AlertTriangle,
  Coins,
  Plus,
  Search,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Inventario, InventarioTipo } from "@/core/inventory/interfaces";
import {
  useGetInventariosQuery,
  useGetInventariosBajoStockQuery,
} from "@/modules/inventory/domain/hooks/useInventarioQueries";
import {
  TIPO_FILTERS,
  TipoFilterValue,
  TIPO_LABELS,
} from "@/modules/inventory/features/constants";
import {
  calcularValorInventario,
  formatPrecioSoles,
  getStockNivel,
} from "@/modules/inventory/features/utils";
import { CreateInventarioDialog } from "@/presentation/dashboard/admin/inventory/create-inventario-dialog";
import { UpdateInventarioDialog } from "@/presentation/dashboard/admin/inventory/update-inventario-dialog";
import { StockStatusBadge } from "@/presentation/dashboard/admin/inventory/stock-status-badge";

export default function InventorySuppliesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [tipoFilter, setTipoFilter] = useState<TipoFilterValue>("ALL");
  const [soloBajoStock, setSoloBajoStock] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedInventario, setSelectedInventario] =
    useState<Inventario | null>(null);

  const apiFilters = useMemo(() => {
    const filters: { tipo?: InventarioTipo; bajo_stock?: boolean } = {};
    if (tipoFilter !== "ALL") filters.tipo = tipoFilter;
    if (soloBajoStock) filters.bajo_stock = true;
    return Object.keys(filters).length > 0 ? filters : undefined;
  }, [tipoFilter, soloBajoStock]);

  const { data: inventarios = [], isLoading } =
    useGetInventariosQuery(apiFilters);
  const { data: bajoStockItems = [], isLoading: loadingBajoStock } =
    useGetInventariosBajoStockQuery();

  const filteredInventory = useMemo(() => {
    return inventarios.filter((item) => {
      const q = searchQuery.toLowerCase();
      return (
        item.nombre.toLowerCase().includes(q) ||
        (item.descripcion || "").toLowerCase().includes(q)
      );
    });
  }, [inventarios, searchQuery]);

  const hasActiveViewFilters =
    searchQuery.trim() !== "" || tipoFilter !== "ALL" || soloBajoStock;

  const kpis = useMemo(() => {
    const totalItems = filteredInventory.reduce(
      (acc, curr) => acc + curr.stock_actual,
      0,
    );
    const enVistaActual = filteredInventory.filter(
      (item) =>
        getStockNivel(item.stock_actual, item.stock_minimo) !== "OPTIMO",
    ).length;
    const totalValue = calcularValorInventario(filteredInventory);

    return {
      totalItems,
      requierenReabastecimiento: bajoStockItems.length,
      enVistaActual,
      totalValue,
    };
  }, [filteredInventory, bajoStockItems]);

  const handleSelect = (item: Inventario) => {
    setSelectedInventario(item);
    setIsUpdateOpen(true);
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-extrabold tracking-tight text-dark-primary">
            Inventario y Suministros
          </h2>
          <p className="text-dark-secondary text-sm max-w-2xl leading-relaxed">
            Controle los niveles de stock, supervise las solicitudes de
            reabastecimiento y gestione los suministros críticos del hotel en
            tiempo real.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-brand-blue hover:bg-blue-600 text-white font-semibold rounded-xl text-xs flex items-center gap-2 py-3.5 px-5 shadow-lg shadow-brand-blue/15 transition-all cursor-pointer self-start md:self-center"
        >
          <Plus className="h-4.5 w-4.5" />
          Añadir Artículo
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-[115px]">
          <span className="text-[10px] font-extrabold text-dark-secondary/80 tracking-widest uppercase">
            Unidades en Stock
          </span>
          <div className="flex items-end justify-between mt-2">
            {isLoading ? (
              <Skeleton className="h-9 w-20" />
            ) : (
              <span className="text-3xl font-extrabold text-dark-primary tracking-tight">
                {kpis.totalItems.toLocaleString()}
              </span>
            )}
            <span className="bg-zinc-50 text-dark-secondary p-1.5 rounded-lg">
              <Package className="h-4.5 w-4.5" />
            </span>
          </div>
          {hasActiveViewFilters && !isLoading && (
            <span className="text-[10px] font-semibold text-dark-secondary/70 mt-2">
              En la vista filtrada
            </span>
          )}
        </div>

        <div
          className={`border rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-[115px] transition-all ${
            kpis.requierenReabastecimiento > 0
              ? "bg-red-50/50 border-red-100 text-red-600"
              : "bg-white border-zinc-100 text-dark-primary"
          }`}
        >
          <span className="text-[10px] font-extrabold tracking-widest uppercase opacity-80">
            Requieren Reabastecimiento
          </span>
          <div className="flex items-end justify-between mt-2">
            {loadingBajoStock ? (
              <Skeleton className="h-9 w-12" />
            ) : (
              <span
                className={`text-3xl font-extrabold tracking-tight ${kpis.requierenReabastecimiento > 0 ? "text-red-600" : "text-dark-primary"}`}
              >
                {kpis.requierenReabastecimiento}
              </span>
            )}
            <span
              className={`p-1.5 rounded-lg ${kpis.requierenReabastecimiento > 0 ? "bg-red-100/50 text-red-500" : "bg-zinc-50 text-dark-secondary"}`}
            >
              <AlertTriangle className="h-4.5 w-4.5" />
            </span>
          </div>
          {hasActiveViewFilters && !loadingBajoStock && (
            <span className="text-[10px] font-semibold text-dark-secondary/70 mt-2">
              En vista actual: {kpis.enVistaActual}
            </span>
          )}
        </div>

        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-[115px]">
          <span className="text-[10px] font-extrabold text-dark-secondary/80 tracking-widest uppercase">
            Valoración Inventario
          </span>
          <div className="flex items-end justify-between mt-2">
            {isLoading ? (
              <Skeleton className="h-9 w-24" />
            ) : (
              <span className="text-2xl font-extrabold text-brand-blue tracking-tight">
                {formatPrecioSoles(kpis.totalValue)}
              </span>
            )}
            <span className="bg-emerald-50 text-[#00723a] p-1.5 rounded-lg">
              <Coins className="h-4.5 w-4.5" />
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-zinc-100 p-1 rounded-xl overflow-x-auto w-fit max-w-full">
            {TIPO_FILTERS.map((cat) => {
              const isActive = tipoFilter === cat.value;
              return (
                <button
                  key={cat.label}
                  onClick={() => setTipoFilter(cat.value)}
                  className={`text-xs font-extrabold px-4 py-2.5 rounded-lg transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-white text-brand-blue shadow-xs"
                      : "text-dark-secondary hover:text-dark-primary"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setSoloBajoStock((prev) => !prev)}
            className={`text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all shrink-0 cursor-pointer border ${
              soloBajoStock
                ? "bg-red-50 text-red-600 border-red-100"
                : "bg-white text-dark-secondary border-zinc-200 hover:text-dark-primary"
            }`}
          >
            Solo bajo stock
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-dark-secondary/60" />
          <Input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 bg-white border-zinc-200 rounded-xl text-xs h-10 shadow-2xs focus:border-brand-blue/30"
          />
        </div>
      </div>

      <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-zinc-100 text-[10px] font-bold text-dark-secondary/80 tracking-widest uppercase pb-4">
                <th className="pb-4 font-bold text-left">Producto</th>
                <th className="pb-4 font-bold text-left">Tipo</th>
                <th className="pb-4 font-bold text-left">Stock Actual</th>
                <th className="pb-4 font-bold text-left">Estado</th>
                <th className="pb-4 font-bold text-left">Precio Unit.</th>
                <th className="pb-4 font-bold text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-zinc-50">
                    <td colSpan={6} className="py-4">
                      <Skeleton className="h-10 w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredInventory.length > 0 ? (
                filteredInventory.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-zinc-50 hover:bg-zinc-50/20 last:border-0 transition-colors"
                  >
                    <td className="py-4.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-zinc-50 text-dark-secondary border border-zinc-100 flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
                          <Package className="h-4.5 w-4.5 text-zinc-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-dark-primary leading-tight">
                            {item.nombre}
                          </span>
                          {item.descripcion && (
                            <span className="text-[10px] font-semibold text-dark-secondary/70 mt-0.5 line-clamp-1">
                              {item.descripcion}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4.5 pr-4">
                      <span className="text-[10px] font-extrabold text-dark-secondary bg-zinc-100 px-2.5 py-1 rounded-md">
                        {TIPO_LABELS[item.tipo]}
                      </span>
                    </td>

                    <td className="py-4.5 pr-4">
                      <StockStatusBadge item={item} showBar />
                    </td>

                    <td className="py-4.5 pr-4">
                      <StockStatusBadge item={item} />
                    </td>

                    <td className="py-4.5 pr-4 text-xs font-bold text-dark-secondary">
                      {formatPrecioSoles(item.precio_unitario)}
                    </td>

                    <td className="py-4.5 text-right">
                      <button
                        onClick={() => handleSelect(item)}
                        className="text-xs font-bold text-brand-blue hover:text-blue-700 px-2.5 py-1.5 hover:bg-blue-50/50 rounded-lg transition-colors cursor-pointer"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-xs font-medium text-dark-secondary"
                  >
                    No se encontraron artículos para el filtro seleccionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-zinc-100/60 text-xs text-dark-secondary select-none">
          <span>
            Mostrando {filteredInventory.length} de {inventarios.length}{" "}
            artículos
          </span>
        </div>
      </div>

      <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-extrabold text-red-600 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Requieren Reabastecimiento
          </h3>
          <p className="text-[11px] font-semibold text-dark-secondary leading-relaxed">
            Artículos con stock actual en o por debajo del mínimo configurado en
            todo el inventario.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {loadingBajoStock ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-red-500" />
            </div>
          ) : bajoStockItems.length > 0 ? (
            bajoStockItems.map((item) => {
              const nivel = getStockNivel(item.stock_actual, item.stock_minimo);
              const isAgotado = nivel === "AGOTADO";

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-zinc-50 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isAgotado
                          ? "bg-red-50 text-red-500"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      <AlertTriangle className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-dark-primary leading-tight truncate">
                        {item.nombre}
                      </span>
                      <span
                        className={`text-[10px] font-semibold mt-0.5 ${isAgotado ? "text-red-500" : "text-amber-600"}`}
                      >
                        Stock: {item.stock_actual} / mín: {item.stock_minimo} ·{" "}
                        {TIPO_LABELS[item.tipo]}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border hidden sm:inline ${
                        isAgotado
                          ? "bg-red-50 text-red-500 border-red-100"
                          : "bg-amber-50 text-amber-600 border-amber-100"
                      }`}
                    >
                      {isAgotado ? "Agotado" : "Bajo stock"}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleSelect(item)}
                      className={`text-[10px] h-8 px-3 rounded-lg cursor-pointer ${
                        isAgotado
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "border-zinc-200 bg-white text-dark-secondary hover:text-dark-primary"
                      }`}
                      variant={isAgotado ? "default" : "outline"}
                    >
                      Gestionar
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-dark-secondary text-center py-6">
              Todos los artículos están dentro del margen de seguridad.
            </p>
          )}
        </div>
      </div>

      <CreateInventarioDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
      <UpdateInventarioDialog
        key={
          selectedInventario
            ? `update-${selectedInventario.id}-${isUpdateOpen}`
            : "none"
        }
        open={isUpdateOpen}
        onOpenChange={setIsUpdateOpen}
        inventario={selectedInventario}
      />
    </div>
  );
}
