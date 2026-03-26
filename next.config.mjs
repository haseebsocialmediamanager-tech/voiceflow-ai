/** @type {import('next').NextConfig} */
const nextConfig = {
  // For Vercel / Node.js hosting — full features including API routes
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "linkedwin.io", "www.linkedwin.io"],
    },
  },
  // Allow images from any domain
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
