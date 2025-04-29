import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // No explicit i18n config needed here when using next-international middleware
  // i18n: {
  //   locales: ['en', 'es', 'pt'],
  //   defaultLocale: 'en',
  // },
};

export default nextConfig;
