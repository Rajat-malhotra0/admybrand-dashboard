/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Re-enabled for production
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
