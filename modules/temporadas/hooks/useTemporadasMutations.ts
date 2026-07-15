import { useState } from "react";
import { 
  createTemporadaAction, 
  deleteTemporadaAction 
} from "@/core/temporadas/actions/temporadasActions";

export const useTemporadasMutations = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const crearTemporada = async (data: any) => {
    setIsSubmitting(true);
    try {
      const res = await createTemporadaAction(data);
      if (res && res.status === "success" && res.data) return res.data;
      return res;
    } catch (error) {
      console.error("Error en useTemporadasMutations [crearTemporada]:", error);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const eliminarTemporada = async (id: number) => {
    setIsSubmitting(true);
    try {
      return await deleteTemporadaAction(id);
    } catch (error) {
      console.error("Error en useTemporadasMutations [eliminarTemporada]:", error);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    crearTemporada,
    eliminarTemporada
  };
};