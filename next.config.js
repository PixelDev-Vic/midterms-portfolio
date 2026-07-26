/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // ── Cloudinary CDN ───────────────────────────────────────────────────
      // All media uploaded via /api/upload is served from res.cloudinary.com.
      // Add additional trusted hostnames here explicitly — never use "**".
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;