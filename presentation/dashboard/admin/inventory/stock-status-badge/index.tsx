import { Inventario } from "@/core/inventory/interfaces";
import {
  getStockNivel,
  getStockConfig,
  getStockBarWidth,
} from "@/modules/inventory/features/utils";

interface StockStatusBadgeProps {
  item: Pick<Inventario, "stock_actual" | "stock_minimo">;
  showBar?: boolean;
}

export function StockStatusBadge({ item, showBar = false }: StockStatusBadgeProps) {
  const nivel = getStockNivel(item.stock_actual, item.stock_minimo);
  const config = getStockConfig(nivel);

  if (showBar) {
    return (
      <div className="flex flex-col gap-1.5 max-w-[130px]">
        <div className="flex items-baseline justify-between text-xs font-bold">
          <span className="text-dark-primary">{item.stock_actual}</span>
          <span className="text-[10px] text-dark-secondary font-medium">
            min {item.stock_minimo}
          </span>
        </div>
        <div className="w-full bg-zinc-100 h-1 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${config.barColor}`}
            style={{ width: `${getStockBarWidth(item.stock_actual, item.stock_minimo)}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <span className={config.badgeClass}>
      ● {config.label}
    </span>
  );
}
