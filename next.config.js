/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      'phaser3spectorjs': false,
    };
    return config;
  },
}

module.exports = nextConfig
