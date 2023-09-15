// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// };

module.exports = {
  // eslint-disable-next-line prettier/prettier
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
