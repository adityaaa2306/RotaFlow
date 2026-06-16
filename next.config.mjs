/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/favicon.ico",
        destination: "/icon.svg",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/x/status",
        destination: "/api/twitter/status",
      },
      {
        source: "/api/x/publish",
        destination: "/api/twitter/publish",
      },
    ];
  },
};

export default nextConfig;
