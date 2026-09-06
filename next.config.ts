import type { NextConfig } from "next";

// На GitHub Pages сайт лежит не в корне домена, а в подпапке с именем
// репозитория: moonwalkerlion-ui.github.io/mobility-app/. Значение приходит из
// переменной NEXT_PUBLIC_BASE_PATH (её задаёт workflow сборки).
// Локально переменной нет → пусто → `npm run dev` работает по обычному адресу.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
};

export default nextConfig;
