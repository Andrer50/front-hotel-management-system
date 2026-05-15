"use client";

import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { createContext, useContext, useMemo } from "react";

interface SessionContextType {
  session: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
  isLoading: boolean;
  isAuthenticated: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

/**
 * Provider para gestionar la sesión globalmente
 */
export function SessionContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const value = useMemo(
    () => ({
      session,
      status,
      isLoading: status === "loading",
      isAuthenticated: status === "authenticated",
    }),
    [session, status],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

/**
 * Hook para acceder a la sesión desde cualquier componente
 */
export function useSessionContext() {
  const context = useContext(SessionContext);

  if (context === undefined) {
    throw new Error(
      "useSessionContext debe ser usado dentro de SessionContextProvider",
    );
  }

  return context;
}
