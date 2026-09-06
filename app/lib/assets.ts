// Пути к файлам из папки public/ (фото, позже — видео).
//
// Зачем нужно: на GitHub Pages сайт открывается по адресу с подпапкой
// (/mobility-app/). Свои css/js Next.js подставляет туда сам, а вот обычный
// <img src="/covers/x.jpg"> он не трогает — такая ссылка уедет в корень домена
// и картинка не найдётся. Поэтому все пути к статике гоняем через asset().

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** asset("/covers/1.jpg") → "/mobility-app/covers/1.jpg" на GitHub Pages. */
export function asset(path: string): string {
  return `${basePath}${path}`;
}
