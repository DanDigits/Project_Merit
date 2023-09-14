/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/Dashboard/Home",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
