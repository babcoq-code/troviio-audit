import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_BASE_URL ?? "http://localhost:8000"}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.amazon.com" },
      { protocol: "https", hostname: "*.amazon.fr" },
      { protocol: "https", hostname: "**.fnac.com" },
      { protocol: "https", hostname: "**.boulanger.com" },
      { protocol: "https", hostname: "**.cdiscount.com" },
      { protocol: "https", hostname: "**.darty.com" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
