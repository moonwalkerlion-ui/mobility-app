// Обложка программы/движения/зоны: реальное фото + тёмный градиент для глубины
// (кинематографичный вид, как у GOWOD). Фото — бесплатные стоковые (Pexels),
// лежат в public/covers/. Выбираются стабильно по id (без случайности).
// Позже сюда же можно подставить свои фото/видео.

type Props = {
  id: string;
  className?: string;
};

// Пул скачанных стоковых фото (public/covers/<name>.jpg).
const photos = [
  "4854279",
  "6339343",
  "6339336",
  "6974989",
  "7530433",
  "6339359",
  "8173452",
];

/** Стабильное число из строки-id (одинаковое при каждом рендере). */
function seedFrom(id: string): number {
  let s = 0;
  for (let i = 0; i < id.length; i++) {
    s = (s * 31 + id.charCodeAt(i)) >>> 0;
  }
  return s;
}

export function WorkoutArt({ id, className }: Props) {
  const photo = photos[seedFrom(id) % photos.length];

  return (
    <div
      className={`relative overflow-hidden bg-surface-2 ${className ?? ""}`}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/covers/${photo}.jpg`}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover"
      />
      {/* Тёмный градиент снизу — глубина + плавный переход к интерфейсу. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,20,34,0.15) 0%, rgba(10,20,34,0) 35%, rgba(10,20,34,0.55) 78%, rgba(10,20,34,0.9) 100%)",
        }}
      />
    </div>
  );
}
