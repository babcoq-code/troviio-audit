import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  srcDir: "src",
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  webpack: (config: any) => config,
  serverExternalPackages: [],
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
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.troviio.com" }],
        destination: "https://troviio.com/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
