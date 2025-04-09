import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the app to build even with TypeScript errors (not recommended for production)
  typescript: {
    ignoreBuildErrors: true,
  },
  target: 'serverless',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
      },
    ],
  },
};

export default nextConfig;
