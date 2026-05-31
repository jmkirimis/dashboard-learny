import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    // Remove chamadas de console.* no build de produção (mantém logs limpos para o usuário final)
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fotos-learny.s3.us-east-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
