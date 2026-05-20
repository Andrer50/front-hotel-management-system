export type StockNivel = "OPTIMO" | "BAJO" | "AGOTADO";

export function getStockNivel(
  stockActual: number,
  stockMinimo: number,
): StockNivel {
  if (stockActual === 0) return "AGOTADO";
  if (stockActual <= stockMinimo) return "BAJO";
  return "OPTIMO";
}

export function getStockConfig(nivel: StockNivel) {
  switch (nivel) {
    case "OPTIMO":
      return {
        label: "ÓPTIMO",
        badgeClass:
          "inline-flex items-center gap-1 bg-[#e2fbe8] text-[#00723a] text-[10px] font-extrabold px-3 py-1 rounded-full border border-[#cbf7d5]",
        barColor: "bg-[#00723a]",
        pulse: false,
      };
    case "BAJO":
      return {
        label: "BAJO STOCK",
        badgeClass:
          "inline-flex items-center gap-1 bg-amber-50 text-amber-600 text-[10px] font-extrabold px-3 py-1 rounded-full border border-amber-100 animate-pulse",
        barColor: "bg-amber-500",
        pulse: true,
      };
    case "AGOTADO":
      return {
        label: "AGOTADO",
        badgeClass:
          "inline-flex items-center gap-1 bg-red-50 text-red-500 text-[10px] font-extrabold px-3 py-1 rounded-full border border-red-100",
        barColor: "bg-red-500",
        pulse: false,
      };
  }
}

export function getStockBarWidth(
  stockActual: number,
  stockMinimo: number,
): number {
  const denominator = stockMinimo * 2 || 1;
  return Math.min(Math.max((stockActual / denominator) * 100, 4), 100);
}

export function calcularValorInventario(
  items: { stock_actual: number; precio_unitario: string }[],
): number {
  return items.reduce(
    (acc, item) =>
      acc + item.stock_actual * (parseFloat(item.precio_unitario) || 0),
    0,
  );
}

export function formatPrecioSoles(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) || 0 : value;
  return `S/ ${num.toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
