import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "./query-provider";
import { Toaster } from "@/components/ui/sonner";
import NextAuthProvider from "./session-provider";
import { SessionContextProvider } from "@/context/session-context";

export interface ProvidersProps {
  children: React.ReactNode;
}
export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <NextAuthProvider>
        <SessionContextProvider>
          <TooltipProvider>
            {children}
            <Toaster position="top-right" />
          </TooltipProvider>
        </SessionContextProvider>
      </NextAuthProvider>
    </QueryProvider>
  );
}
