import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages (Edge Runtime) との互換性のため
  // Node.js 固有の組み込みモジュールへの依存を避ける
  experimental: {
    // @cloudflare/next-on-pages が Edge Runtime 向けにビルドを変換する
  },
};

export default nextConfig;
