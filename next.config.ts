import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    // We run `tsc --noEmit` directly in CI/local checks, which avoids a Windows EPERM
    // issue with Next's internal TypeScript worker spawn in this environment.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
