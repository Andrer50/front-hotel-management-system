"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSessionContext } from "@/context/session-context";
import { navigationItems } from "@/core/shared/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function PermissionGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, isLoading, isAuthenticated } = useSessionContext();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    const userPermissions = session?.user?.permissions || [];

    // Buscar si la ruta actual requiere algún permiso
    const currentNavItem = navigationItems.find(
      (item) => pathname === item.href,
    );

    if (currentNavItem?.permission) {
      const hasPermission = userPermissions.includes(currentNavItem.permission);
      if (!hasPermission) {
        setIsAuthorized(false);
        router.push("/dashboard/admin/users"); // O una página de "No autorizado"
        return;
      }
    }

    setIsAuthorized(true);
  }, [pathname, session, isLoading, isAuthenticated, router]);

  if (isLoading || isAuthorized === null) {
    return (
      <div className="space-y-4 p-8">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (isAuthorized === false) {
    return null; // El useEffect ya se encarga de redirigir
  }

  return <>{children}</>;
}
