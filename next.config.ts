import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "ssf0txms9kpjxnoo.public.blob.vercel-storage.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/@:username",
        destination: "/:username",
      },
      {
        source: "/@:username/opengraph-image",
        destination: "/:username/opengraph-image",
      },
      {
        source: "/@:username/twitter-image",
        destination: "/:username/twitter-image",
      },
    ];
  },
};

export default nextConfig;
