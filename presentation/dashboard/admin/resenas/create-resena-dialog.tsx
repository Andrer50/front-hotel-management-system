"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Star, MessageSquarePlus, User, BedDouble, Calendar } from "lucide-react";
import { useCreateResenaMutation } from "@/modules/resena/domain/hooks/useResenaMutations";
import { useGetStaysQuery } from "@/modules/resena/domain/hooks/useResenaQueries";

interface CreateResenaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateResenaDialog({
  isOpen,
  onOpenChange,
}: CreateResenaDialogProps) {
  const { data: stays = [], isLoading: isLoadingStays } = useGetStaysQuery();
  const createResenaMutation = useCreateResenaMutation();

  const validationSchema = Yup.object().shape({
    estadia: Yup.string().required("Debe seleccionar una estadía."),
    calificacion: Yup.number()
      .min(1, "La calificación debe ser al menos 1.")
      .max(5, "La calificación máxima es 5.")
      .required("La calificación es obligatoria."),
    comentario: Yup.string().optional(),
  });

  const formik = useFormik({
    initialValues: {
      estadia: "",
      calificacion: 5,
      comentario: "",
    },
    validationSchema,
    onSubmit: (values) => {
      createResenaMutation.mutate(
        {
          estadia: Number(values.estadia),
          calificacion: values.calificacion,
          comentario: values.comentario || undefined,
        },
        {
          onSuccess: () => {
            toast.success("Reseña Registrada", {
              description: "La reseña ha sido registrada exitosamente.",
            });
            formik.resetForm();
            onOpenChange(false);
          },
          onError: (error) => {
            toast.error("Error al registrar reseña", {
              description: error.message || "Ocurrió un problema en el servidor.",
            });
          },
        }
      );
    },
  });

  const handleStarClick = (rating: number) => {
    formik.setFieldValue("calificacion", rating);
  };

  const selectedStayDetails = stays.find(
    (s) => s.id.toString() === formik.values.estadia
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-brand-blue to-blue-700 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <MessageSquarePlus className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-extrabold">Crear Nueva Reseña</DialogTitle>
              <DialogDescription className="text-white/80 text-xs mt-0.5">
                Registra la valoración del huésped sobre su estadía
              </DialogDescription>
            </div>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Estadía */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="estadia" className="text-xs font-bold text-dark-primary">
              Estadía (Huésped)
            </Label>
            {isLoadingStays ? (
              <div className="flex items-center gap-2 text-xs text-dark-secondary italic py-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-blue" />
                Cargando estadías disponibles...
              </div>
            ) : stays.length === 0 ? (
              <div className="text-xs text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">
                No hay estadías completadas disponibles para reseñar.
              </div>
            ) : (
              <Select
                value={formik.values.estadia}
                onValueChange={(val) => formik.setFieldValue("estadia", val)}
              >
                <SelectTrigger id="estadia" className="text-xs rounded-xl border-zinc-200 h-10">
                  <SelectValue placeholder="Seleccione la estadía..." />
                </SelectTrigger>
                <SelectContent className="bg-white border-zinc-100">
                  {stays.map((stay) => (
                    <SelectItem key={stay.id} value={stay.id.toString()} className="text-xs">
                      Reserva {stay.reserva_codigo} — {stay.huesped_nombre} (Hab. {stay.habitacion_numero})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {formik.touched.estadia && formik.errors.estadia && (
              <span className="text-[11px] font-medium text-red-500 ml-1">
                {formik.errors.estadia}
              </span>
            )}
          </div>

          {/* Tarjeta de Detalles de Estadía si hay una seleccionada */}
          {selectedStayDetails && (
            <div className="bg-zinc-50 rounded-xl p-3.5 border border-zinc-100/50 flex flex-col gap-2 animate-fade-in text-[11px]">
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-zinc-400" />
                <span className="font-bold text-dark-primary">{selectedStayDetails.huesped_nombre}</span>
              </div>
              <div className="flex items-center gap-2">
                <BedDouble className="h-3.5 w-3.5 text-zinc-400" />
                <span className="text-dark-secondary">
                  Habitación: <strong className="text-dark-primary">{selectedStayDetails.habitacion_numero}</strong>
                </span>
              </div>
              {selectedStayDetails.fecha_entrada && selectedStayDetails.fecha_salida && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="text-dark-secondary">
                    Período: {new Date(selectedStayDetails.fecha_entrada).toLocaleDateString("es-ES")} - {new Date(selectedStayDetails.fecha_salida).toLocaleDateString("es-ES")}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Calificación (Estrellas) */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-bold text-dark-primary">Calificación</Label>
            <div className="flex items-center gap-1.5 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className="focus:outline-none transition-transform active:scale-95 cursor-pointer"
                >
                  <Star
                    className={`h-7 w-7 transition-colors ${
                      star <= formik.values.calificacion
                        ? "fill-amber-400 text-amber-400"
                        : "text-zinc-200 hover:text-amber-200"
                    }`}
                  />
                </button>
              ))}
            </div>
            {formik.touched.calificacion && formik.errors.calificacion && (
              <span className="text-[11px] font-medium text-red-500 ml-1">
                {formik.errors.calificacion}
              </span>
            )}
          </div>

          {/* Comentario */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="comentario" className="text-xs font-bold text-dark-primary">
              Comentario (Opcional)
            </Label>
            <Textarea
              id="comentario"
              name="comentario"
              placeholder="Escribe el comentario del huésped..."
              value={formik.values.comentario}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="text-xs rounded-xl resize-none h-24 border-zinc-200 p-3"
            />
          </div>

          {/* Acciones */}
          <div className="flex gap-3 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 text-xs rounded-xl border-zinc-200 h-10 font-bold"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createResenaMutation.isPending || stays.length === 0}
              className="flex-1 bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold rounded-xl h-10"
            >
              {createResenaMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
              ) : (
                "Guardar Reseña"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
