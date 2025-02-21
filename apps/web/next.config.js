/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "res.cloudinary.com",
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
      {
        hostname: "assets.loket.com",
      },
    ],
  },
};

export default nextConfig;
