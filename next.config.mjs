/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['kxtapuebivyoqwkdhphb.supabase.co'], // Add your Supabase storage domain here
  },
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
