"use client";

import React, { useEffect } from "react";
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
import { toast } from "sonner";
import { Loader2, Reply, MessageSquare } from "lucide-react";
import { useResponderResenaMutation } from "@/modules/resena/domain/hooks/useResenaMutations";
import { Resena } from "@/core/resena/interfaces";

interface ReplyResenaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  resena: Resena | null;
}

export function ReplyResenaDialog({
  isOpen,
  onOpenChange,
  resena,
}: ReplyResenaDialogProps) {
  const responderMutation = useResponderResenaMutation();

  const validationSchema = Yup.object().shape({
    respuesta_administrador: Yup.string()
      .trim()
      .required("La respuesta del administrador es obligatoria."),
  });

  const formik = useFormik({
    initialValues: {
      respuesta_administrador: "",
    },
    validationSchema,
    onSubmit: (values) => {
      if (!resena) return;

      responderMutation.mutate(
        {
          id: resena.id,
          respuesta_administrador: values.respuesta_administrador,
        },
        {
          onSuccess: () => {
            toast.success("Respuesta Registrada", {
              description: `Se ha guardado la respuesta a la reseña de ${resena.huesped_nombre}.`,
            });
            formik.resetForm();
            onOpenChange(false);
          },
          onError: (error) => {
            toast.error("Error al registrar respuesta", {
              description: error.message || "Ocurrió un problema en el servidor.",
            });
          },
        }
      );
    },
  });

  // Pre-cargar la respuesta existente si el administrador la está editando
  useEffect(() => {
    if (resena) {
      formik.setFieldValue("respuesta_administrador", resena.respuesta_administrador || "");
    } else {
      formik.resetForm();
    }
  }, [resena]);

  if (!resena) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-700 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Reply className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-extrabold">Responder Reseña</DialogTitle>
              <DialogDescription className="text-white/80 text-xs mt-0.5">
                Huésped: {resena.huesped_nombre}
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {/* Comentario del Huésped (lectura) */}
          <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-dark-primary">
              <MessageSquare className="h-3.5 w-3.5 text-brand-blue" />
              <span>Comentario del huésped:</span>
            </div>
            <p className="text-xs text-dark-secondary leading-relaxed italic">
              "{resena.comentario || "Sin comentario escrito, solo calificación."}"
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
            {/* Campo de Respuesta */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="respuesta_administrador" className="text-xs font-bold text-dark-primary">
                Respuesta del Administrador
              </Label>
              <Textarea
                id="respuesta_administrador"
                name="respuesta_administrador"
                placeholder="Escribe la respuesta oficial del hotel..."
                value={formik.values.respuesta_administrador}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="text-xs rounded-xl resize-none h-32 border-zinc-200 p-3"
              />
              {formik.touched.respuesta_administrador && formik.errors.respuesta_administrador && (
                <span className="text-[11px] font-medium text-red-500 ml-1">
                  {formik.errors.respuesta_administrador}
                </span>
              )}
            </div>

            {/* Acciones */}
            <div className="flex gap-3 mt-1">
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
                disabled={responderMutation.isPending}
                className="flex-1 bg-zinc-800 hover:bg-zinc-900 text-white text-xs font-bold rounded-xl h-10"
              >
                {responderMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                ) : (
                  "Enviar Respuesta"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
