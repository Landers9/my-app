/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'appcommands-staging.milleniumtechs.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      // Ajouter d'autres domaines si nécessaire
      {
        protocol: 'https',
        hostname: 'milleniumtechs.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  // Autres configurations...
}

module.exports = nextConfig