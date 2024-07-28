/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'st2.depositphotos.com',
          },
        ],
      },
};

export default nextConfig;
