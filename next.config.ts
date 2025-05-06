import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.gamewith.jp',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.altema.jp',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
