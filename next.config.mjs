/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    // Fix for pino-pretty not found
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Node built-ins used by pino → walletconnect chain
        fs: false,
        net: false,
        tls: false,
        dns: false,
        os: false,
        path: false,
        stream: false,
        crypto: false,
        http: false,
        https: false,
        zlib: false,
        worker_threads: false,
        // pino transports not needed in browser
        'pino-pretty': false,
        'pino/file': false,
        'thread-stream': false,
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
