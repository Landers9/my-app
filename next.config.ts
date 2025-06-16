/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'votre-domaine-production.com', // Pour la production
        pathname: '/storage/**',
      },
    ],
  },
}

module.exports = nextConfig