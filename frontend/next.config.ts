import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  srcDir: "src",
  webpack: (config: any) => config,
  // Trust the Host header from Cloudflare Tunnel (bypass HTTPS redirect)
  serverExternalPackages: [],
  // Disable static generation entirely — React 19 + Next 15.3.1 has a bug
  // with _not-found static generation and Client Component event handlers
  outputFileTracingExcludes: {
    "/*": [".next/static/**/*"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_BASE_URL ?? "http://backend:8000"}/api/:path*`,
      },
    ];
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
