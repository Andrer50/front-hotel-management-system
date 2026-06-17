"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Receipt,
  Printer,
  Loader2,
  CreditCard,
  Wallet,
  Landmark,
  Download,
} from "lucide-react";
import { useGetConsumosExtraQuery } from "@/modules/consumo-extra/domain/hooks/useConsumoExtraQueries";
import { useGetComprobanteQuery } from "@/modules/billing/domain/hooks/useBillingQueries";
import {
  useCreateComprobanteMutation,
  useDownloadComprobantePDFMutation,
} from "@/modules/billing/domain/hooks/useBillingMutations";
import { Reservation } from "@/core/reservation/interfaces";
import { BillingConcept, BillingType, PaymentMethod } from "@/core/shared";

interface BillingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: Reservation | null;
}

export function BillingDialog({
  isOpen,
  onOpenChange,
  reservation,
}: BillingDialogProps) {
  const reservaId = reservation?.id || 0;

  // Query existing invoice from database
  const { data: existingComprobante, isLoading: isLoadingComprobante } =
    useGetComprobanteQuery(reservaId);

  const isReadOnly = !!existingComprobante;

  const [billingType, setBillingType] = useState<BillingType>("BOLETA");
  const [concept, setConcept] = useState<BillingConcept>("TODO");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("EFECTIVO");

  // Form states
  const [clientDoc, setClientDoc] = useState(
    reservation?.huesped_documento || "",
  );
  const [clientName, setClientName] = useState(
    reservation?.huesped_nombre || "",
  );

  const createComprobanteMutation = useCreateComprobanteMutation(reservaId);
  const isEmitting = createComprobanteMutation.isPending;
  const downloadComprobantePDFMutation = useDownloadComprobantePDFMutation();

  // Sync state if already exists in DB
  const displayBillingType = existingComprobante
    ? existingComprobante.tipo_comprobante
    : billingType;
  const displayClientDoc = existingComprobante
    ? existingComprobante.documento_cliente
    : clientDoc;
  const displayClientName = existingComprobante
    ? existingComprobante.nombre_cliente
    : clientName;
  const displayPaymentMethod = existingComprobante
    ? existingComprobante.metodo_pago
    : paymentMethod;

  const handleBillingTypeChange = (type: BillingType) => {
    if (isReadOnly) return;
    setBillingType(type);
    if (type === "BOLETA") {
      setClientDoc(reservation?.huesped_documento || "");
      setClientName(reservation?.huesped_nombre || "");
    } else {
      setClientDoc("");
      setClientName("");
    }
  };

  const { data: consumos = [] } = useGetConsumosExtraQuery(reservaId);

  // Calculations
  const roomPrice = reservation?.total || 0;
  const extraPrice = reservation?.consumos_extra_total || 0;

  const totalAmount = useMemo(() => {
    if (existingComprobante)
      return parseFloat(String(existingComprobante.monto_total));
    if (concept === "HABITACION") return roomPrice;
    if (concept === "CONSUMOS") return extraPrice;
    return roomPrice + extraPrice;
  }, [existingComprobante, concept, roomPrice, extraPrice]);

  const receiptNumber = useMemo(() => {
    if (existingComprobante) return existingComprobante.numero_completo || "";
    const prefix = billingType === "BOLETA" ? "B001" : "F001";
    const code = reservation?.codigo_reserva || "AST-000000";
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
      hash = code.charCodeAt(i) + ((hash << 5) - hash);
    }
    const num = Math.abs(hash % 900000) + 100000;
    return `${prefix}-${num}`;
  }, [existingComprobante, billingType, reservation?.codigo_reserva]);

  const igvAmount = useMemo(() => {
    return totalAmount - totalAmount / 1.18;
  }, [totalAmount]);

  const subtotalAmount = useMemo(() => {
    return totalAmount / 1.18;
  }, [totalAmount]);

  const handleEmit = () => {
    if (isReadOnly) {
      toast.info("Comprobante enviado a la impresora", {
        description: `Reimprimiendo ${existingComprobante?.numero_completo}...`,
      });
      onOpenChange(false);
      return;
    }

    const currentDoc = clientDoc.trim();
    const currentName = clientName.trim();

    if (!currentDoc) {
      toast.error(
        `Por favor ingrese el ${billingType === "BOLETA" ? "DNI" : "RUC"} del cliente`,
      );
      return;
    }
    if (!currentName) {
      toast.error(
        `Por favor ingrese el ${
          billingType === "BOLETA" ? "nombre" : "nombre/razón social"
        } del cliente`,
      );
      return;
    }

    createComprobanteMutation.mutate(
      {
        reserva: reservaId,
        tipo_comprobante: billingType,
        documento_cliente: currentDoc,
        nombre_cliente: currentName,
        metodo_pago: paymentMethod,
        monto_total: totalAmount,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  const currentDateStr = useMemo(() => {
    const date = existingComprobante
      ? new Date(existingComprobante.fecha_emision)
      : new Date();
    return date.toLocaleString("es-PE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }, [existingComprobante]);

  const handleDownload = () => {
    if (!existingComprobante) return;

    toast.loading("Generando PDF...", { id: "download-pdf" });
    downloadComprobantePDFMutation.mutate(existingComprobante.id, {
      onSuccess: (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${receiptNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("Comprobante descargado con éxito", {
          id: "download-pdf",
        });
      },
      onError: (error) => {
        toast.error("Error al descargar el comprobante", {
          id: "download-pdf",
        });
        console.error(error);
      },
    });
  };

  if (!reservation) return null;

  if (isLoadingComprobante) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl p-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#031c46]" />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-zinc-50 rounded-2xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#031c46] p-5 text-white flex-shrink-0 flex items-center justify-between">
          <div>
            <DialogTitle className="text-base font-extrabold tracking-wider">
              FACTURACIÓN Y COBRO
            </DialogTitle>
            <DialogDescription className="text-white/80 text-xs mt-1">
              Genere el comprobante de pago para la estadía.
            </DialogDescription>
          </div>
          <Receipt className="h-6 w-6 text-blue-300 opacity-80" />
        </div>

        {/* Dos columnas: Controles a la izquierda, Preview POS a la derecha */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna Izquierda: Configuración del cobro */}
          <div className="flex flex-col gap-4 bg-white p-5 rounded-2xl border border-zinc-200/50">
            <h3 className="text-xs font-extrabold text-zinc-700 tracking-wider uppercase">
              Configuración de Facturación
            </h3>

            {/* Tipo de Comprobante */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-zinc-700">
                Tipo de Comprobante
              </Label>
              <Select
                value={displayBillingType}
                onValueChange={handleBillingTypeChange}
                disabled={isReadOnly}
              >
                <SelectTrigger className="h-10 text-xs rounded-xl">
                  <SelectValue placeholder="Seleccione el comprobante" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BOLETA">Boleta de Venta</SelectItem>
                  <SelectItem value="FACTURA">Factura Comercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Datos del Cliente */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5 col-span-1">
                <Label className="text-xs font-bold text-zinc-700">
                  {displayBillingType === "BOLETA" ? "DNI / CE" : "RUC"}
                </Label>
                <Input
                  type="text"
                  value={displayClientDoc}
                  onChange={(e) => !isReadOnly && setClientDoc(e.target.value)}
                  disabled={isReadOnly}
                  placeholder={
                    displayBillingType === "BOLETA" ? "8 dígitos" : "11 dígitos"
                  }
                  className="h-10 text-xs rounded-xl bg-zinc-50 border-zinc-200"
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs font-bold text-zinc-700">
                  {displayBillingType === "BOLETA"
                    ? "Nombres y Apellidos"
                    : "Razón Social"}
                </Label>
                <Input
                  type="text"
                  value={displayClientName}
                  onChange={(e) => !isReadOnly && setClientName(e.target.value)}
                  disabled={isReadOnly}
                  placeholder="Nombre del cliente"
                  className="h-10 text-xs rounded-xl bg-zinc-50 border-zinc-200"
                />
              </div>
            </div>

            {/* Concepto a Cobrar */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-zinc-700">
                Concepto a Facturar
              </Label>
              <Select
                value={concept}
                onValueChange={(val: BillingConcept) =>
                  !isReadOnly && setConcept(val)
                }
                disabled={isReadOnly}
              >
                <SelectTrigger className="h-10 text-xs rounded-xl">
                  <SelectValue placeholder="Concepto a cobrar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">
                    Todo Completo (Habitación + Consumos)
                  </SelectItem>
                  <SelectItem value="HABITACION">Solo Habitación</SelectItem>
                  <SelectItem value="CONSUMOS">Solo Consumos Extra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Método de Pago */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-zinc-700">
                Método de Pago
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => !isReadOnly && setPaymentMethod("EFECTIVO")}
                  disabled={isReadOnly}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${
                    displayPaymentMethod === "EFECTIVO"
                      ? "bg-blue-50 border-brand-blue text-brand-blue"
                      : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100"
                  } ${isReadOnly ? "opacity-75 cursor-not-allowed animate-none" : ""}`}
                >
                  <Wallet className="h-4 w-4 mb-1" />
                  <span className="text-[9px] font-bold">Efectivo</span>
                </button>
                <button
                  type="button"
                  onClick={() => !isReadOnly && setPaymentMethod("TARJETA")}
                  disabled={isReadOnly}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${
                    displayPaymentMethod === "TARJETA"
                      ? "bg-blue-50 border-brand-blue text-brand-blue"
                      : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100"
                  } ${isReadOnly ? "opacity-75 cursor-not-allowed animate-none" : ""}`}
                >
                  <CreditCard className="h-4 w-4 mb-1" />
                  <span className="text-[9px] font-bold">Tarjeta</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    !isReadOnly && setPaymentMethod("TRANSFERENCIA")
                  }
                  disabled={isReadOnly}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${
                    displayPaymentMethod === "TRANSFERENCIA"
                      ? "bg-blue-50 border-brand-blue text-brand-blue"
                      : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100"
                  } ${isReadOnly ? "opacity-75 cursor-not-allowed animate-none" : ""}`}
                >
                  <Landmark className="h-4 w-4 mb-1" />
                  <span className="text-[9px] font-bold">Transferencia</span>
                </button>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Vista previa ticket POS */}
          <div className="flex flex-col bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden min-h-[350px]">
            {/* Header del Ticket */}
            <div className="bg-zinc-900 text-zinc-100 p-4 text-center font-mono text-[10px] space-y-1 flex-shrink-0">
              <p className="font-bold text-xs tracking-wider">
                HOTEL ASTURIAS S.A.C
              </p>
              <p>R.U.C. 20492837482</p>
              <p>Av. Larco 1024, Miraflores - Lima</p>
              <p className="border-t border-dashed border-zinc-700 pt-1 font-bold">
                {billingType === "BOLETA"
                  ? "BOLETA DE VENTA ELECTRONICA"
                  : "FACTURA ELECTRONICA"}
              </p>
              <p className="text-zinc-400 font-bold">{receiptNumber}</p>
            </div>

            {/* Cuerpo del Ticket (POS scroll) */}
            <div className="p-4 font-mono text-[11px] text-zinc-800 space-y-3 overflow-y-auto flex-1 bg-[#fbfbfa]">
              {/* Información de Emisión */}
              <div className="space-y-0.5 border-b border-dashed border-zinc-300 pb-2">
                <p>Fecha de emisión: {currentDateStr}</p>
                <p>
                  Cliente: <span className="font-bold">{clientName}</span>
                </p>
                <p>
                  {billingType === "BOLETA" ? "DNI:" : "RUC:"} {clientDoc}
                </p>
                <p>Cajero: Administrador (Admin)</p>
                <p>Reserva: {reservation.codigo_reserva}</p>
              </div>

              {/* Lista de Conceptos a cobrar */}
              <div className="space-y-2">
                <div className="flex justify-between font-bold border-b border-dashed border-zinc-300 pb-1">
                  <span>DESCRIPCION</span>
                  <span>TOTAL</span>
                </div>

                {/* 1. Habitación */}
                {(concept === "HABITACION" || concept === "TODO") && (
                  <div className="flex justify-between">
                    <span>
                      Hospedaje Hab. {reservation.habitacion_numero} (x
                      {reservation.noches} noches)
                    </span>
                    <span>S/. {roomPrice.toFixed(2)}</span>
                  </div>
                )}

                {/* 2. Consumos Extra */}
                {(concept === "CONSUMOS" || concept === "TODO") && (
                  <>
                    {consumos.length > 0 ? (
                      consumos.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between pl-2"
                        >
                          <span className="text-zinc-500">
                            - {item.descripcion} (x{item.cantidad})
                          </span>
                          <span className="text-zinc-500">
                            S/.{" "}
                            {(
                              parseFloat(item.precio_unitario) * item.cantidad
                            ).toFixed(2)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-between pl-2 text-zinc-400 italic">
                        <span>- Sin consumos adicionales</span>
                        <span>S/. 0.00</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Totales y Separadores */}
              <div className="border-t border-dashed border-zinc-300 pt-2 space-y-1">
                <div className="flex justify-between">
                  <span>SUBTOTAL (SIN IGV)</span>
                  <span>S/. {subtotalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>I.G.V. (18.00%)</span>
                  <span>S/. {igvAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-xs border-t border-dashed border-zinc-400 pt-1">
                  <span>TOTAL</span>
                  <span>S/. {totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-zinc-300 pt-2 text-center text-[9px] text-zinc-500 space-y-1">
                <p>Pago recibido vía: {paymentMethod}</p>
                <p>Representación impresa de comprobante electrónico</p>
                <p className="font-bold">¡GRACIAS POR SU PREFERENCIA!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-200 p-5 bg-white flex items-center justify-between flex-shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-wider">
              Total a Cobrar
            </span>
            <span className="text-xl font-extrabold text-[#031c46] tracking-tight">
              S/. {totalAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-xs font-bold px-5 h-10 rounded-xl"
            >
              Cancelar
            </Button>
            {isReadOnly && (
              <Button
                variant="outline"
                onClick={handleDownload}
                disabled={downloadComprobantePDFMutation.isPending}
                className="text-xs font-bold px-5 h-10 rounded-xl flex items-center gap-1.5 border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 disabled:opacity-50"
              >
                <Download className="h-4 w-4 text-zinc-500" />
                Descargar
              </Button>
            )}
            <Button
              onClick={handleEmit}
              disabled={isEmitting || isLoadingComprobante}
              className="bg-[#031c46] hover:bg-blue-900 text-white text-xs font-bold px-6 h-10 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              {isEmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Printer className="h-4 w-4" />
              )}
              {isEmitting
                ? "Emitiendo..."
                : isReadOnly
                  ? "Reimprimir Comprobante"
                  : "Emitir Comprobante"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
