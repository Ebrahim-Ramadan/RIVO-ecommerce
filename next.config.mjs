/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'st2.depositphotos.com',
          },
          {
            protocol: 'https',
            hostname: 'i.postimg.cc',
          },
        ],
      },
};

export default nextConfig;
