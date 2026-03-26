/**
 * STATIC EXPORT CONFIG — for Hostinger shared hosting (public_html)
 * Use this when you DON'T have Node.js/VPS hosting.
 *
 * Limitation: /api/enhance won't work server-side.
 * Enhancement will fall back to client-side filler-word cleanup only.
 * For full AI features, use Vercel (see DEPLOY_GUIDE.md)
 *
 * To build static version:
 *   cp next.config.static.mjs next.config.mjs
 *   npm run build
 *   Then upload the /out folder to public_html
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
