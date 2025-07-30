/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export", // Disabled for local development
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
