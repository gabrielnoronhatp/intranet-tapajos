/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
      };
    }
    return config;
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  server: {
    https: true,
    http2: true
  }
};

module.exports = nextConfig;
