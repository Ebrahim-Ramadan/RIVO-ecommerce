/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      // loader: 'custom',
      // loaderFile: './components/loader.js',
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'i.postimg.cc',
          },
        ],
      },
};
export default nextConfig;
