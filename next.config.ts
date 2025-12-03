import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      }
    ],
  },
  devIndicators: {
    buildActivity: false,
    appIsrStatus: false,
  } as any,
};

export default nextConfig;