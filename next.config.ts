/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don’t bundle @napi-rs/canvas, use it directly at runtime
      config.externals.push("@napi-rs/canvas");
    }
    return config;
  },
};

module.exports = nextConfig;
