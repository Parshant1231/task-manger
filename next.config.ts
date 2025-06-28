import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["localhost"], // ✅ Add this line
  },
};

export default nextConfig;
