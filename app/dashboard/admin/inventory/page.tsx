"use client";

import { useState, useMemo } from "react";
import { 
  Package, 
  AlertTriangle, 
  Truck, 
  DollarSign, 
  Plus, 
  Search, 
  SlidersHorizontal,
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Clock, 
  ShoppingCart,
  CheckCircle2,
  XCircle,
  TrendingDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: "Amenidades" | "Blancos" | "Limpieza" | "Alimentos & Bebidas";
  stockActual: number;
  stockMinimo: number;
  unit: string;
  status: "OPTIMO" | "BAJO" | "AGOTADO";
  supplier: string;
}

const initialInventory: InventoryItem[] = [
  {
    id: "1",
    sku: "INV-TWL-01",
    name: "Toallas de Baño Premium",
    category: "Blancos",
    stockActual: 180,
    stockMinimo: 50,
    unit: "unidades",
    status: "OPTIMO",
    supplier: "Textiles del Norte S.A."
  },
  {
    id: "2",
    sku: "INV-SHP-02",
    name: "Set Champú Lavanda 50ml",
    category: "Amenidades",
    stockActual: 35,
    stockMinimo: 100,
    unit: "unidades",
    status: "BAJO",
    supplier: "Amenity Lux Corp"
  },
  {
    id: "3",
    sku: "INV-DET-03",
    name: "Detergente Ecológico Conc.",
    category: "Limpieza",
    stockActual: 12,
    stockMinimo: 10,
    unit: "bidones",
    status: "OPTIMO",
    supplier: "EcoClean Industrial"
  },
  {
    id: "4",
    sku: "INV-MIN-04",
    name: "Agua Mineral Premium 330ml",
    category: "Alimentos & Bebidas",
    stockActual: 0,
    stockMinimo: 80,
    unit: "unidades",
    status: "AGOTADO",
    supplier: "Distribuidora del Valle"
  },
  {
    id: "5",
    sku: "INV-SHT-05",
    name: "Sábanas Algodón Egipcio King",
    category: "Blancos",
    stockActual: 95,
    stockMinimo: 30,
    unit: "unidades",
    status: "OPTIMO",
    supplier: "Textiles del Norte S.A."
  },
  {
    id: "6",
    sku: "INV-COF-06",
    name: "Cápsulas Café Intenso Espresso",
    category: "Alimentos & Bebidas",
    stockActual: 15,
    stockMinimo: 120,
    unit: "unidades",
    status: "BAJO",
    supplier: "Nestle Professional"
  }
];

export default function InventorySuppliesPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | "Amenidades" | "Blancos" | "Limpieza" | "Alimentos & Bebidas">("ALL");

  // Filtros de inventario
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesCategory = categoryFilter === "ALL" || item.category === categoryFilter;
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [inventory, categoryFilter, searchQuery]);

  // Cálculos dinámicos de KPIs
  const kpis = useMemo(() => {
    const totalItems = filteredInventory.reduce((acc, curr) => acc + curr.stockActual, 0);
    const lowStockAlerts = filteredInventory.filter((item) => item.status === "BAJO" || item.status === "AGOTADO").length;
    // Pedidos en ruta fijos basados en items bajos
    const onRouteOrders = lowStockAlerts > 0 ? 2 : 0;
    // Valor total estimado de inventario simulado
    const totalValue = filteredInventory.reduce((acc, curr) => {
      const unitValue = curr.category === "Blancos" ? 35 : curr.category === "Limpieza" ? 45 : 3;
      return acc + (curr.stockActual * unitValue);
    }, 0) + 12000;

    return { totalItems, lowStockAlerts, onRouteOrders, totalValue };
  }, [filteredInventory]);

  const handleAdjustStock = (name: string) => {
    toast(`Ajuste de Inventario: ${name}`, {
      description: "Abriendo panel de recuento de stock manual para auditoría interna."
    });
  };

  const handleOrderRestock = (name: string, supplier: string) => {
    toast.success(`Orden de Compra Iniciada`, {
      description: `Generando cotización rápida de suministro para ${name} con ${supplier}.`
    });
  };

  const handleCreateItem = () => {
    toast.success("Nuevo Suministro", {
      description: "Iniciando registro de nuevo producto en el catálogo general de compras."
    });
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      
      {/* Cabecera y botón de añadir */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-extrabold tracking-tight text-dark-primary">
            Inventario y Suministros
          </h2>
          <p className="text-dark-secondary text-sm max-w-2xl leading-relaxed">
            Controle los niveles de stock, supervise las solicitudes de reabastecimiento y gestione los suministros críticos del hotel en tiempo real.
          </p>
        </div>

        <Button 
          onClick={handleCreateItem}
          className="bg-brand-blue hover:bg-blue-600 text-white font-semibold rounded-xl text-xs flex items-center gap-2 py-3.5 px-5 shadow-lg shadow-brand-blue/15 transition-all cursor-pointer self-start md:self-center"
        >
          <Plus className="h-4.5 w-4.5" />
          Añadir Suministro
        </Button>
      </div>

      {/* Grid de KPI Cards (4 Columnas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1 */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-[115px]">
          <span className="text-[10px] font-extrabold text-dark-secondary/80 tracking-widest uppercase">
            Suministros Totales
          </span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-extrabold text-dark-primary tracking-tight">
              {kpis.totalItems.toLocaleString()}
            </span>
            <span className="bg-zinc-50 text-dark-secondary p-1.5 rounded-lg">
              <Package className="h-4.5 w-4.5" />
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className={`border rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-[115px] transition-all ${
          kpis.lowStockAlerts > 0 
            ? "bg-red-50/50 border-red-100 text-red-600" 
            : "bg-white border-zinc-100 text-dark-primary"
        }`}>
          <span className="text-[10px] font-extrabold tracking-widest uppercase opacity-80">
            Alertas de Stock Bajo
          </span>
          <div className="flex items-end justify-between mt-2">
            <span className={`text-3xl font-extrabold tracking-tight ${kpis.lowStockAlerts > 0 ? "text-red-600" : "text-dark-primary"}`}>
              {kpis.lowStockAlerts}
            </span>
            <span className={`p-1.5 rounded-lg ${kpis.lowStockAlerts > 0 ? "bg-red-100/50 text-red-500" : "bg-zinc-50 text-dark-secondary"}`}>
              <AlertTriangle className="h-4.5 w-4.5" />
            </span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-[115px]">
          <span className="text-[10px] font-extrabold text-dark-secondary/80 tracking-widest uppercase">
            Reabastecimiento en Ruta
          </span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-extrabold text-dark-primary tracking-tight">
              {kpis.onRouteOrders}
            </span>
            <span className="bg-blue-50 text-brand-blue p-1.5 rounded-lg">
              <Truck className="h-4.5 w-4.5" />
            </span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-[115px]">
          <span className="text-[10px] font-extrabold text-dark-secondary/80 tracking-widest uppercase">
            Valoración Suministros
          </span>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-extrabold text-brand-blue tracking-tight">
              ${kpis.totalValue.toLocaleString()}
            </span>
            <span className="bg-emerald-50 text-[#00723a] p-1.5 rounded-lg">
              <DollarSign className="h-4.5 w-4.5" />
            </span>
          </div>
        </div>

      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Píldoras de Categoría */}
        <div className="flex bg-zinc-100 p-1 rounded-xl overflow-x-auto w-fit max-w-full">
          {([
            { label: "Todos", value: "ALL" },
            { label: "Blancos", value: "Blancos" },
            { label: "Amenidades", value: "Amenidades" },
            { label: "Limpieza", value: "Limpieza" },
            { label: "Alimentos & Bebidas", value: "Alimentos & Bebidas" }
          ] as const).map((cat) => {
            const isActive = categoryFilter === cat.value;
            return (
              <button
                key={cat.label}
                onClick={() => setCategoryFilter(cat.value)}
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

        {/* Buscador */}
        <div className="relative w-full sm:w-72">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-dark-secondary/60" />
          <Input
            type="text"
            placeholder="Buscar por producto, SKU o proveedor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 bg-white border-zinc-200 rounded-xl text-xs h-10 shadow-2xs focus:border-brand-blue/30"
          />
        </div>

      </div>

      {/* Tabla del Catálogo de Inventario */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-zinc-100 text-[10px] font-bold text-dark-secondary/80 tracking-widest uppercase pb-4">
                <th className="pb-4 font-bold text-left">Producto</th>
                <th className="pb-4 font-bold text-left">Categoría</th>
                <th className="pb-4 font-bold text-left">Stock Actual</th>
                <th className="pb-4 font-bold text-left">Estado</th>
                <th className="pb-4 font-bold text-left">Proveedor Principal</th>
                <th className="pb-4 font-bold text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => (
                  <tr key={item.id} className="border-b border-zinc-50 hover:bg-zinc-50/20 last:border-0 transition-colors">
                    
                    {/* Producto */}
                    <td className="py-4.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-zinc-50 text-dark-secondary border border-zinc-100 flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
                          <Package className="h-4.5 w-4.5 text-zinc-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-dark-primary leading-tight">
                            {item.name}
                          </span>
                          <span className="text-[10px] font-semibold text-dark-secondary/70 mt-0.5">
                            {item.sku}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Categoría */}
                    <td className="py-4.5 pr-4">
                      <span className="text-[10px] font-extrabold text-dark-secondary bg-zinc-100 px-2.5 py-1 rounded-md">
                        {item.category}
                      </span>
                    </td>

                    {/* Stock Actual con barra de nivel */}
                    <td className="py-4.5 pr-4">
                      <div className="flex flex-col gap-1.5 max-w-[130px]">
                        <div className="flex items-baseline justify-between text-xs font-bold">
                          <span className="text-dark-primary">{item.stockActual}</span>
                          <span className="text-[10px] text-dark-secondary font-medium">min {item.stockMinimo} {item.unit}</span>
                        </div>
                        <div className="w-full bg-zinc-100 h-1 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              item.status === "OPTIMO" ? "bg-[#00723a]" :
                              item.status === "BAJO" ? "bg-amber-500" : "bg-red-500"
                            }`} 
                            style={{ 
                              width: `${Math.min(Math.max((item.stockActual / (item.stockMinimo * 2)) * 100, 4), 100)}%` 
                            }} 
                          />
                        </div>
                      </div>
                    </td>

                    {/* Estado de Stock */}
                    <td className="py-4.5 pr-4">
                      {item.status === "OPTIMO" && (
                        <span className="inline-flex items-center gap-1 bg-[#e2fbe8] text-[#00723a] text-[10px] font-extrabold px-3 py-1 rounded-full border border-[#cbf7d5]">
                          ● ÓPTIMO
                        </span>
                      )}
                      {item.status === "BAJO" && (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 text-[10px] font-extrabold px-3 py-1 rounded-full border border-amber-100 animate-pulse">
                          ● BAJO STOCK
                        </span>
                      )}
                      {item.status === "AGOTADO" && (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-500 text-[10px] font-extrabold px-3 py-1 rounded-full border border-red-100">
                          ● AGOTADO
                        </span>
                      )}
                    </td>

                    {/* Proveedor */}
                    <td className="py-4.5 pr-4 text-xs font-bold text-dark-secondary">
                      {item.supplier}
                    </td>

                    {/* Acciones */}
                    <td className="py-4.5 text-right">
                      <div className="flex items-center justify-end gap-2 pl-4">
                        <button
                          onClick={() => handleAdjustStock(item.name)}
                          className="text-xs font-bold text-dark-secondary hover:text-dark-primary px-2.5 py-1.5 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                        >
                          Ajustar
                        </button>
                        <button
                          onClick={() => handleOrderRestock(item.name, item.supplier)}
                          className="text-xs font-bold text-brand-blue hover:text-blue-700 px-2.5 py-1.5 hover:bg-blue-50/50 rounded-lg transition-colors cursor-pointer"
                        >
                          Pedir
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs font-medium text-dark-secondary">
                    No se encontraron suministros para el filtro seleccionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-100/60 text-xs text-dark-secondary select-none">
          <span>Mostrando {filteredInventory.length} de {filteredInventory.length} productos</span>
          
          <div className="flex items-center gap-1 font-semibold">
            <button className="text-dark-secondary hover:text-dark-primary disabled:opacity-50 font-bold cursor-pointer" disabled>Anterior</button>
            <span className="text-zinc-300">|</span>
            <button className="text-dark-secondary hover:text-dark-primary font-bold cursor-pointer" onClick={() => toast("Cargando catálogo siguiente...")}>Siguiente</button>
          </div>
        </div>

      </div>

      {/* Grid Inferior (Pedidos de Reabastecimiento & Alertas Críticas) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Solicitudes de Compra / Reabastecimiento */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-[220px]">
          
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-dark-primary flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-brand-blue" />
                Pedidos de Compra Activos
              </h3>
              <button 
                onClick={() => toast("Abriendo panel general de proveedores...")}
                className="text-xs font-bold text-brand-blue hover:underline cursor-pointer"
              >
                | Catálogo Compras
              </button>
            </div>
            <p className="text-[11px] font-semibold text-dark-secondary leading-relaxed">
              Órdenes de suministro autorizadas por gerencia de compras
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            {/* Fila 1 */}
            <div className="flex items-center justify-between border-b border-zinc-50 pb-3 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center">
                  <Truck className="h-4.5 w-4.5 animate-bounce" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-dark-primary leading-tight">Cargamento Champú Premium</span>
                  <span className="text-[10px] font-semibold text-dark-secondary/70 mt-0.5">Amenity Lux • ETA: 2 días</span>
                </div>
              </div>
              
              <span className="bg-blue-50 text-brand-blue text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-blue-100">
                En Ruta
              </span>
            </div>

            {/* Fila 2 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="h-4.5 w-4.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-dark-primary leading-tight">Lote Sábanas Algodón</span>
                  <span className="text-[10px] font-semibold text-dark-secondary/70 mt-0.5">Textiles del Norte • Procesando pago</span>
                </div>
              </div>
              
              <span className="bg-[#e2fbe8] text-[#00723a] text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-[#cbf7d5]">
                Aprobado
              </span>
            </div>
          </div>

        </div>

        {/* Card 2: Alertas Críticas de Stock */}
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between min-h-[220px]">
          
          <div className="flex flex-col gap-1.5">
            <h3 className="text-base font-extrabold text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-4.5 w-4.5" />
              Suministros Críticos (STOCK COMPROMETIDO)
            </h3>
            <p className="text-[11px] font-semibold text-dark-secondary leading-relaxed">
              Suministros vitales para la operación diaria por debajo del margen de seguridad.
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-3">
            {/* Alerta 1 */}
            <div className="flex items-start justify-between border-b border-zinc-50 pb-2.5 last:border-0 last:pb-0">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-dark-primary">Agua Mineral Premium 330ml</span>
                <span className="text-[10px] font-semibold text-red-500 mt-0.5">Stock actual: 0 unidades (Margen crítico: 80)</span>
              </div>
              <Button
                size="sm"
                onClick={() => handleOrderRestock("Agua Mineral Premium 330ml", "Distribuidora del Valle")}
                className="bg-red-600 hover:bg-red-700 text-white text-[10px] h-8 px-3 rounded-lg cursor-pointer"
              >
                Comprar Ya
              </Button>
            </div>

            {/* Alerta 2 */}
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-dark-primary">Cápsulas Café Espresso</span>
                <span className="text-[10px] font-semibold text-amber-500 mt-0.5">Stock actual: 15 unidades (Margen crítico: 120)</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOrderRestock("Cápsulas Café Espresso", "Nestle Professional")}
                className="border-zinc-200 bg-white text-dark-secondary hover:text-dark-primary text-[10px] h-8 px-3 rounded-lg cursor-pointer"
              >
                Notificar Compras
              </Button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
