/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to enable API routes
  turbopack: {
    root: __dirname,
  },
  images: {
    unoptimized: true,
  },
  // Allow dev server access from network
  allowedDevOrigins: ['172.20.20.20'],
}

module.exports = nextConfig
