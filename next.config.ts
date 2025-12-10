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
        hostname: "storage.c2.liara.space",
      },
      {
        protocol: "https",
        hostname: "s3.ir-thr-at1.arvanstorage.ir",
      },
      {
        protocol: "https",
        hostname: "cs-khu-object-storage.s3.ir-thr-at1.arvanstorage.ir",
      }
    ],
  },
};

export default nextConfig;