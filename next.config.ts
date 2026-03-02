const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'static.wixstatic.com' },
      { protocol: 'https', hostname: 'artworkbird.co.in' },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/firebase-messaging-sw.js', destination: '/api/firebase-sw' },
      ],
    }
  },
};

export default nextConfig;
