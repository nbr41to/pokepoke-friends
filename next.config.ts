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
    ],
  },
};

export default nextConfig;
