"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Calendar,
  Download,
  Loader2,
  Eye,
  Wallet,
  CreditCard,
  Landmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import { BillingDialog } from "@/presentation/dashboard/admin/reservations/billing-dialog";
import { useGetComprobantesQuery } from "@/modules/billing/domain/hooks/useBillingQueries";
import { useGetReservationQuery } from "@/modules/reservation/domain/hooks/useReservationQueries";
import { BillingType, PaymentMethod } from "@/core/shared";

const ITEMS_PER_PAGE = 8;

export default function PaymentsPage() {
  const { data: comprobantes = [], isLoading: isLoadingComprobantes } =
    useGetComprobantesQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [docTypeFilter, setDocTypeFilter] = useState<BillingType | "ALL">(
    "ALL",
  );
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<
    PaymentMethod | "ALL"
  >("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReservaId, setSelectedReservaId] = useState<number | null>(
    null,
  );
  const [isBillingDialogOpen, setIsBillingDialogOpen] = useState(false);

  // Fetch the reservation details when an invoice row is clicked to view/print it
  const { data: reservation = null, isLoading: isLoadingReservation } =
    useGetReservationQuery(selectedReservaId || 0);

  // Filter comprobantes based on search text and category tabs
  const filteredComprobantes = useMemo(() => {
    return comprobantes.filter((item) => {
      const matchesDocType =
        docTypeFilter === "ALL" || item.tipo_comprobante === docTypeFilter;
      const matchesPaymentMethod =
        paymentMethodFilter === "ALL" ||
        item.metodo_pago === paymentMethodFilter;

      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        item.nombre_cliente.toLowerCase().includes(searchLower) ||
        item.documento_cliente.includes(searchQuery) ||
        (item.numero_completo &&
          item.numero_completo.toLowerCase().includes(searchLower)) ||
        (item.reserva_codigo &&
          item.reserva_codigo.toLowerCase().includes(searchLower));

      return matchesDocType && matchesPaymentMethod && matchesSearch;
    });
  }, [comprobantes, docTypeFilter, paymentMethodFilter, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredComprobantes.length / ITEMS_PER_PAGE);
  const paginatedComprobantes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredComprobantes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredComprobantes, currentPage]);

  // KPIs
  const kpis = useMemo(() => {
    const totalFacturado = filteredComprobantes.reduce(
      (acc, item) => acc + parseFloat(String(item.monto_total)),
      0,
    );
    const countBoletas = filteredComprobantes.filter(
      (item) => item.tipo_comprobante === "BOLETA",
    ).length;
    const countFacturas = filteredComprobantes.filter(
      (item) => item.tipo_comprobante === "FACTURA",
    ).length;

    // Determine preferred payment method
    const methods = filteredComprobantes.map((item) => item.metodo_pago);
    const methodCounts = methods.reduce(
      (acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    let preferredMethod = "Ninguno";
    let maxCount = 0;
    Object.entries(methodCounts).forEach(([method, count]) => {
      if (count > maxCount) {
        maxCount = count;
        preferredMethod = method;
      }
    });

    return {
      totalFacturado,
      countBoletas,
      countFacturas,
      preferredMethod:
        preferredMethod.charAt(0) + preferredMethod.slice(1).toLowerCase(),
    };
  }, [filteredComprobantes]);

  const handleViewComprobante = (reservaId: number) => {
    setSelectedReservaId(reservaId);
    setIsBillingDialogOpen(true);
  };

  const handleExportData = () => {
    toast.info("Exportación en curso", {
      description: "Generando archivo CSV del listado de facturación...",
    });
  };

  if (isLoadingComprobantes) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-10 w-10 text-brand-blue animate-spin" />
        <p className="text-sm font-medium text-dark-secondary italic animate-pulse">
          Cargando registros de facturación desde el servidor...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-dark-secondary/60">
          <span>ADMINISTRACIÓN</span>
          <span className="text-zinc-300 font-light">&gt;</span>
          <span className="text-brand-blue">REGISTRO DE PAGOS</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-1">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-dark-primary">
              Registro de Pagos y Comprobantes
            </h2>
            <p className="text-dark-secondary text-sm max-w-2xl leading-relaxed">
              Consulte el historial de boletas y facturas electrónicas emitidas,
              realice filtros avanzados y visualice o reimprima los duplicados
              de tickets.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col gap-1">
          <span className="text-[10px] font-extrabold text-dark-secondary/80 tracking-widest uppercase">
            Total Recaudado
          </span>
          <span className="text-3xl font-extrabold text-emerald-600 tracking-tight mt-1">
            S/. {kpis.totalFacturado.toFixed(2)}
          </span>
        </div>

        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col gap-1">
          <span className="text-[10px] font-extrabold text-dark-secondary/80 tracking-widest uppercase">
            Boletas Emitidas
          </span>
          <span className="text-3xl font-extrabold text-brand-blue tracking-tight mt-1">
            {kpis.countBoletas}
          </span>
        </div>

        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col gap-1">
          <span className="text-[10px] font-extrabold text-dark-secondary/80 tracking-widest uppercase">
            Facturas Emitidas
          </span>
          <span className="text-3xl font-extrabold text-brand-blue tracking-tight mt-1">
            {kpis.countFacturas}
          </span>
        </div>

        <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col gap-1">
          <span className="text-[10px] font-extrabold text-dark-secondary/80 tracking-widest uppercase">
            Medio de Pago Principal
          </span>
          <span className="text-3xl font-extrabold text-dark-primary tracking-tight mt-1">
            {kpis.preferredMethod}
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 min-w-0">
        <div className="flex flex-col lg:flex-row lg:flex-wrap items-stretch lg:items-center gap-3 flex-1 min-w-0">
          {/* Search bar */}
          <div className="relative flex-1 max-w-sm min-w-[260px]">
            <Search className="h-3.5 w-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-secondary/60" />
            <Input
              type="text"
              placeholder="Buscar por cliente, documento o número..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 bg-white border-zinc-200 rounded-xl text-xs h-10 focus:border-brand-blue/30 transition-all shadow-xs w-full min-w-0"
            />
          </div>

          {/* Doc Type Filter */}
          <div className="flex bg-zinc-100 p-1 rounded-xl w-fit">
            {(["ALL", "BOLETA", "FACTURA"] as const).map((type) => {
              const isActive = docTypeFilter === type;
              return (
                <button
                  key={type}
                  onClick={() => {
                    setDocTypeFilter(type);
                    setCurrentPage(1);
                  }}
                  className={`text-[11px] font-bold px-3.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-white text-brand-blue shadow-xs"
                      : "text-dark-secondary hover:text-dark-primary hover:bg-zinc-200/50"
                  }`}
                >
                  {type === "ALL" ? "Todos los Comprobantes" : type}
                </button>
              );
            })}
          </div>

          {/* Payment Method Filter */}
          <div className="flex bg-zinc-100 p-1 rounded-xl w-fit">
            {(["ALL", "EFECTIVO", "TARJETA", "TRANSFERENCIA"] as const).map(
              (method) => {
                const isActive = paymentMethodFilter === method;
                return (
                  <button
                    key={method}
                    onClick={() => {
                      setPaymentMethodFilter(method);
                      setCurrentPage(1);
                    }}
                    className={`text-[11px] font-bold px-3.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-white text-brand-blue shadow-xs"
                        : "text-dark-secondary hover:text-dark-primary hover:bg-zinc-200/50"
                    }`}
                  >
                    {method === "ALL"
                      ? "Todos los Métodos"
                      : method.charAt(0) + method.slice(1).toLowerCase()}
                  </button>
                );
              },
            )}
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-10 px-4 rounded-xl border-zinc-200 bg-white text-dark-secondary hover:text-dark-primary flex items-center gap-2 text-xs font-semibold shadow-xs cursor-pointer"
            onClick={() => toast("Rango de fechas de facturación abierto")}
          >
            <Calendar className="h-4 w-4 text-dark-secondary/70" />
            Rango: Todos
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-xl border-zinc-200 bg-white text-dark-secondary hover:text-dark-primary shadow-xs cursor-pointer"
            onClick={handleExportData}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-zinc-100 text-[10px] font-bold text-dark-secondary/80 tracking-widest uppercase">
                <th className="pb-4 font-bold text-left">N° Comprobante</th>
                <th className="pb-4 font-bold text-left">Tipo</th>
                <th className="pb-4 font-bold text-left">Cliente</th>
                <th className="pb-4 font-bold text-left">Doc. Cliente</th>
                <th className="pb-4 font-bold text-left">Reserva</th>
                <th className="pb-4 font-bold text-left">Medio Pago</th>
                <th className="pb-4 font-bold text-left">Monto</th>
                <th className="pb-4 font-bold text-left">Fecha Emisión</th>
                <th className="pb-4 font-bold text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {paginatedComprobantes.length > 0 ? (
                paginatedComprobantes.map((item) => {
                  const isBoleta = item.tipo_comprobante === "BOLETA";
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-zinc-50 hover:bg-zinc-50/40 transition-colors last:border-0"
                    >
                      {/* Code */}
                      <td className="py-4.5 pr-4">
                        <span className="text-xs font-mono font-bold text-dark-primary">
                          {item.numero_completo}
                        </span>
                      </td>

                      {/* Type Badge */}
                      <td className="py-4.5 pr-4 text-xs font-medium">
                        {isBoleta ? (
                          <span className="inline-flex items-center bg-zinc-100 text-zinc-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            BOLETA
                          </span>
                        ) : (
                          <span className="inline-flex items-center bg-blue-50 text-brand-blue text-[10px] font-bold px-2 py-0.5 rounded-md border border-blue-100">
                            FACTURA
                          </span>
                        )}
                      </td>

                      {/* Client Name */}
                      <td className="py-4.5 pr-4 text-xs font-bold text-dark-primary">
                        {item.nombre_cliente}
                      </td>

                      {/* Document */}
                      <td className="py-4.5 pr-4 text-xs font-medium text-dark-secondary">
                        {item.documento_cliente}
                      </td>

                      {/* Reservation Code */}
                      <td className="py-4.5 pr-4 text-xs font-semibold text-dark-secondary">
                        {item.reserva_codigo}
                      </td>

                      {/* Payment Method */}
                      <td className="py-4.5 pr-4 text-xs font-medium text-dark-secondary">
                        <div className="flex items-center gap-1.5">
                          {item.metodo_pago === "EFECTIVO" ? (
                            <Wallet className="h-3.5 w-3.5 text-zinc-500" />
                          ) : item.metodo_pago === "TARJETA" ? (
                            <CreditCard className="h-3.5 w-3.5 text-zinc-500" />
                          ) : (
                            <Landmark className="h-3.5 w-3.5 text-zinc-500" />
                          )}
                          <span className="capitalize">
                            {item.metodo_pago.toLowerCase()}
                          </span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-4.5 pr-4 text-xs font-bold text-brand-blue">
                        S/. {parseFloat(String(item.monto_total)).toFixed(2)}
                      </td>

                      {/* Date */}
                      <td className="py-4.5 pr-4 text-xs font-medium text-dark-secondary">
                        {new Date(item.fecha_emision).toLocaleDateString(
                          "es-PE",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4.5 text-right text-xs">
                        <button
                          onClick={() => handleViewComprobante(item.reserva)}
                          className="text-brand-blue hover:text-blue-700 font-bold flex items-center justify-end gap-1 transition-colors cursor-pointer ml-auto hover:bg-zinc-50 p-1.5 rounded-lg"
                        >
                          <Eye className="h-4 w-4" />
                          Ver
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="py-12 text-center text-xs font-medium text-dark-secondary"
                  >
                    No se encontraron comprobantes emitidos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-zinc-100/60 text-xs text-dark-secondary select-none">
          <span>
            Mostrando{" "}
            {paginatedComprobantes.length > 0
              ? (currentPage - 1) * ITEMS_PER_PAGE + 1
              : 0}
            -{(currentPage - 1) * ITEMS_PER_PAGE + paginatedComprobantes.length}{" "}
            de {filteredComprobantes.length} resultados
          </span>

          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  text="Anterior"
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer h-8 w-8 rounded-lg"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  text="Siguiente"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {/* Loading Overlay while fetching reservation details */}
      {selectedReservaId && isLoadingReservation && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 shadow-xl flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
            <p className="text-xs font-bold text-dark-secondary">
              Obteniendo detalles de reserva...
            </p>
          </div>
        </div>
      )}

      {/* Reusing Billing Dialog in Read-Only Mode */}
      {isBillingDialogOpen && selectedReservaId && reservation && (
        <BillingDialog
          key={`billing-${selectedReservaId}`}
          isOpen={isBillingDialogOpen}
          onOpenChange={(open) => {
            setIsBillingDialogOpen(open);
            if (!open) {
              setSelectedReservaId(null);
            }
          }}
          reservation={reservation}
        />
      )}
    </div>
  );
}
