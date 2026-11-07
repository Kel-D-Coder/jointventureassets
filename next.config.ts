import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // 90 for the listing gallery, so photos stay sharp; 75 (the default) everywhere else.
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co'
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com'
      }
    ]
  }
};

export default nextConfig;
