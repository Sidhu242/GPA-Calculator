/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        canvas: false,
        encoding: false,
        'node-fetch': false,
      };

      // Alias node-specific tesseract worker to the browser version
      config.resolve.alias = {
        ...config.resolve.alias,
        'tesseract.js/src/worker/node/index.js': false,
        'tesseract.js/src/worker/node/loadImage.js': false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
