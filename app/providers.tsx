import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "./query-provider";
import { Toaster } from "@/components/ui/sonner";
import NextAuthProvider from "./session-provider";
export interface ProvidersProps {
  children: React.ReactNode;
}
export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <NextAuthProvider>
        <TooltipProvider>
          {children}
          <Toaster position="top-right" />
        </TooltipProvider>
      </NextAuthProvider>
    </QueryProvider>
  );
}
