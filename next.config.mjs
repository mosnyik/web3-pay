/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Fix for pino-pretty not found
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        'pino-pretty': false,
      };
    }
    
    return config;
  },
  // Transpile specific modules that cause issues
  transpilePackages: [
    '@rainbow-me/rainbowkit',
    '@wagmi',
    'wagmi',
    'viem',
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
