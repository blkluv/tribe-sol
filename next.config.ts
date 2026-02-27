import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/tapestry/:path*",
        destination: `${process.env.TAPESTRY_BASE_URL || "https://api.dev.usetapestry.dev/v1"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
