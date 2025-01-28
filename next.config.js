/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // protocol: "https",
        hostname: "utfs.io",
        // pathname: "/f/**", // Adjust the pathname as per your requirements
      },
    ],
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
