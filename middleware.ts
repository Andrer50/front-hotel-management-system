import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Mapeo manual de rutas a permisos requeridos
// Se usa un objeto simple para no importar archivos complejos en el middleware
const ROUTE_PERMISSIONS: Record<string, string> = {
  "/dashboard/admin/users": "can_manage_users",
  "/dashboard/admin/roles": "can_manage_roles",
  "/dashboard/admin/reservations": "can_manage_reservations",
  "/dashboard/admin/inventory": "can_manage_inventory",
  "/dashboard/admin/statistics": "can_view_reports",
  "/dashboard/admin/rooms": "can_manage_rooms",
  "/dashboard/admin/common-areas": "can_manage_rooms",
};

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  if (!token) {
    const loginUrl = new URL("/", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Si es Administrador, saltar validaciones de permisos
  const userRole = (token.role as string) || "";
  if (userRole.toLowerCase() === "administrador" || userRole.toLowerCase() === "admin") {
    return NextResponse.next();
  }

  // Verificar si la ruta actual o algun padre requiere permiso
  const userPermissions = (token.permissions as string[]) || [];
  
  // Buscar coincidencia exacta o por prefijo en el mapa de permisos
  for (const [route, permission] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname === route || pathname.startsWith(route + "/")) {
      if (!userPermissions.includes(permission)) {
        // Redirigir al dashboard principal si no tiene permiso
        return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
