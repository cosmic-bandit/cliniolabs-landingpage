/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable Turbopack - use Webpack instead
  experimental: {
    turbo: false,
  },
}

export default nextConfig
