/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: '/stories/:slug*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/timeline/:slug*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/categories/:slug*',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig