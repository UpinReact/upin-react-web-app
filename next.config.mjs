/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config, { dev }) => {
      if (dev) {
        config.watchOptions = {
          ignored: ['**/node_modules/**'], // Example folder to ignore
        };
      }
      return config;
    },
  };
  
  export default nextConfig;