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
  async redirects() {
    return [
      {
        source: '/categories',
        destination: '/',
        permanent: false,
      },
    ];
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
