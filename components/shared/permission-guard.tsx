"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSessionContext } from "@/context/session-context";
import { navigationItems } from "@/core/shared/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function PermissionGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, isLoading, isAuthenticated } = useSessionContext();

  const userPermissions = session?.user?.permissions || [];

  // Buscar si la ruta actual requiere algún permiso
  const currentNavItem = navigationItems.find((item) => pathname === item.href);

  const hasPermission = currentNavItem?.permission
    ? userPermissions.includes(currentNavItem.permission)
    : true;

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    if (currentNavItem?.permission && !hasPermission) {
      router.push("/dashboard/admin/users");
    }
  }, [isLoading, isAuthenticated, currentNavItem, hasPermission, router]);

  if (isLoading) {
    return (
      <div className="space-y-4 p-8">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!isAuthenticated || !hasPermission) {
    return (
      <div className="space-y-4 p-8">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return <>{children}</>;
}
