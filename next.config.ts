import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - explicitly requested by Next.js dev server logs
  allowedDevOrigins: ['192.168.1.4'],
};

export default nextConfig;
