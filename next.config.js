/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // Disable API routes in static export
  rewrites: () => [],
};

module.exports = nextConfig;