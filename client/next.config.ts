import type { NextConfig } from "next";

const backendOrigin = process.env.BACKEND_ORIGIN || "http://localhost:5000";

const nextConfig: NextConfig = {
  /* config options here */
    images : {
        remotePatterns : [
            {
                protocol: 'https',
                hostname: 'app.raangalay.com',
            },
            {
                protocol: 'https',
                hostname: 'placehold.net',
            },
             {
                protocol: 'https',
                hostname: 'risingtheme.com',
            }
        ]
    },
    async rewrites() {
        return [
            {
                source: '/backend-proxy/:path*',
                destination: `${backendOrigin}/:path*`,
            },
        ];
    },
};

export default nextConfig;
