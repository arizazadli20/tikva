import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev and build both use --webpack flag in package.json scripts to bypass
  // the Turbopack PostCSS panic that affects this version (16.2.11).
};

export default nextConfig;
