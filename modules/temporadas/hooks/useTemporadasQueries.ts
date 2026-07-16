import { useState, useCallback } from "react";
import { getTemporadasAction } from "@/core/temporadas/actions/temporadasActions";

export const useTemporadasQueries = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const getTemporadas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTemporadasAction(); 
      
      // Rompemos el envoltorio unificado de Django de manera segura
      if (res && res.status === "success" && Array.isArray(res.data)) {
        return res.data; 
      }
      
      return Array.isArray(res) ? res : [];
    } catch (error) {
      console.error("Error en useTemporadasQueries [getTemporadas]:", error);
      return []; 
    } finally {
      setLoading(false);
    }
  }, []); 

  return { loading, getTemporadas };
};