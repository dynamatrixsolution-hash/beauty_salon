import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.86.10', 'localhost:3000', 'localhost:3001', '192.168.1.72'],
};

export default nextConfig;
