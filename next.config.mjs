/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Wildcard to allow all domains
      },
    ],
  },

  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ignored: ['**/node_modules/**'], // Example folder to ignore
      };
    }
    return config;
  },

  // Add this experimental configuration for Server Actions
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:4000', // Allow requests from localhost
        'symmetrical-umbrella-xp67rq6j46rf699v-4000.app.github.dev', // Allow requests from GitHub Codespaces
      ],
    },
  },
};

export default nextConfig;