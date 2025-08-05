import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http', // or 'https'
        hostname: 'localhost', // or 'localhost' for development
        port: '8000', // or the port your Django backend is running on
        pathname: '/media/',
      },
    ],
  },

};

export default nextConfig;
