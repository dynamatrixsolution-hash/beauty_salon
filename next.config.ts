import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: ['192.168.86.10', 'localhost:3000', 'localhost:3001']
  }
};

export default nextConfig;
