/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '158ea9937b33.ngrok-free.app',
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