/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: 'getstream.io' }],
  },
};

export default nextConfig;
