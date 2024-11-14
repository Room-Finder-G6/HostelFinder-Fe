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
        ],
    },
};

module.exports = nextConfig;
