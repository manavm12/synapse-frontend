import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/synapse/:path*",
        destination: `${process.env.NEXT_PUBLIC_SYNAPSE_URL ?? "https://synapse-message.up.railway.app"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
