/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: "export" to enable API routes and server features
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
