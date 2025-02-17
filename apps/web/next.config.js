/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "assets.loket.com",
      },
      {
        hostname: "via.placeholder.com",
      },
      {
        hostname: "upload.wikimedia.org",
      },
      {
        hostname: "example.com",
      },
    ],
  },
};

export default nextConfig;
