import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Hosts de imágenes que usa la API (el seeder usa picsum.photos). Agrega más si hace falta.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
};

export default nextConfig;
