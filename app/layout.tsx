import type { Metadata } from "next";
import { Montserrat, Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Дисплейный шрифт: Montserrat — жирный геометрический гротеск, как заголовки GOWOD.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
});

// Интерфейсный: Manrope — чистый современный, с поддержкой кириллицы.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

// Моноширинный: для мелких подписей и значений (° / M:SS).
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Mobility App",
  description: "Домашние тренировки и подвижность",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${montserrat.variable} ${manrope.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
