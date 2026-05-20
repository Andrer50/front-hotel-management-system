import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path((?!auth/).*)",
        destination: `${process.env.BACKEND_URL}/api/:path*`,
      },
    ];
  },
  
};

export default nextConfig;
