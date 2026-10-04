import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Metadata (title/description) bloqueante para todos los clientes: queda en el <head>
  // desde el primer byte y los auditores SEO (Lighthouse) la ven siempre.
  htmlLimitedBots: /.*/,
  images: {
    // Hosts de imágenes que usa la API (el seeder usa picsum.photos). Agrega más si hace falta.
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
};

export default nextConfig;
