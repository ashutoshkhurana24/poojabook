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
      {
        protocol: 'https',
        hostname: 'www.zodiacratna.com',
      },
      {
        protocol: 'https',
        hostname: 'mypujapandit.com',
      },
      {
        protocol: 'https',
        hostname: 'servdharm.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
      {
        protocol: 'https',
        hostname: 'imgcdn.stablediffusionweb.com',
      },
      {
        protocol: 'https',
        hostname: 'muktikshetragokarna.com',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
      },
      {
        protocol: 'https',
        hostname: 'akm-img-a-in.tosshub.com',
      },
      {
        protocol: 'https',
        hostname: 'www.mypoojabox.in',
      },
      {
        protocol: 'https',
        hostname: 'www.adotrip.com',
      },
      {
        protocol: 'https',
        hostname: 't3.ftcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'eastindiantraveller.com',
      },
      {
        protocol: 'https',
        hostname: 'thumbs.dreamstime.com',
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
