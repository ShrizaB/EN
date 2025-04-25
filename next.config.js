/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ["via.placeholder.com"],
    },
    eslint: {
      ignoreDuringBuilds: true, // ✅ skips next lint
    },
    typescript: {
      ignoreBuildErrors: true, // ✅ skips TS type checks
    },
  };
  
  module.exports = nextConfig;