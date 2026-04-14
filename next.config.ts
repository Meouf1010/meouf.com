import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname, // Forces Next.js to use THIS folder as the project root
  },
};

export default nextConfig;
