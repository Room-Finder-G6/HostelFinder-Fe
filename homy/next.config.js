// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Other Next.js configurations...
    async headers() {
        return [
          {
            // matching all API routes
            source: "/api/:path*",
            headers: [
              { key: "Access-Control-Allow-Credentials", value: "true" },
              { key: "Access-Control-Allow-Origin", value: "*" },
              { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
              { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
            ]
          }
        ]
      },
    async rewrites() {
        return [
          {
            source: '/api/auth/:path*',
            destination: '/api/auth/:path*',
          },
        ]
      },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'hostel-finder-images.s3.amazonaws.com',
                port: '', // Leave empty unless you use a specific port
                pathname: '**', // Match all paths
            },
            {
                protocol: 'https',
                hostname: 'hostel-finder-images.s3.ap-southeast-1.amazonaws.com',
                port: '', // Leave empty unless you use a specific port
                pathname: '**', // Match all paths
            },
        ],
    },
    env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'https://phongtro247.net', // Đảm bảo NEXTAUTH_URL chính xác
    },
};

module.exports = nextConfig;