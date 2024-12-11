// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Other Next.js configurations...
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