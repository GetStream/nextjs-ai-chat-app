/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'getstream.io' },
      { hostname: 'media.licdn.com' },
    ],
  },
};

export default nextConfig;
