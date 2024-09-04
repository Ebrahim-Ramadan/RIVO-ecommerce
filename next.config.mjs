/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental:{
    // ppr:true,
    dynamicIO : true,
  },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'iili.io',
          },
        ],
      },
};
export default nextConfig;
