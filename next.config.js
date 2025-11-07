/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    // Ignore phaser3spectorjs for client builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        phaser3spectorjs: false,
      };
    }
    config.externals = [...(config.externals || []), { phaser3spectorjs: 'phaser3spectorjs' }];
    return config;
  },
}

module.exports = nextConfig
