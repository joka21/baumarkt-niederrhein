import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // MySQL-Treiber nicht bündeln, sondern zur Laufzeit aus node_modules laden.
  serverExternalPackages: ["mysql2"],
  // Browser fragen /favicon.ico direkt an; das Icon wird aus app/icon.tsx erzeugt.
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/icon" }];
  },
};

export default nextConfig;
