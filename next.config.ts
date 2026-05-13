import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Excluimos las rutas internas de NextAuth y pasamos las peticiones al backend Django bajo el prefijo /api/
        source: "/api/:path((?!auth/(?:session|signin|signout|providers|callback|csrf|_log)).*)*",
        destination: `${process.env.BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
