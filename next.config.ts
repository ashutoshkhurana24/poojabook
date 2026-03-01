const nextConfig = {
  images: {
    unoptimized: true,
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
