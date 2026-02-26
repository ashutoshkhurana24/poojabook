import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        // Serve the service worker dynamically so Firebase env vars are injected at runtime
        { source: '/firebase-messaging-sw.js', destination: '/api/firebase-sw' },
      ],
    }
  },
};

export default nextConfig;
