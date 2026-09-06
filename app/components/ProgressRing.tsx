import type { ReactNode } from "react";

type Props = {
  /** Прогресс от 0 до 1 (0 — пусто, 1 — полный круг). */
  progress: number;
  size?: number;
  stroke?: number;
  children?: ReactNode;
};

// Кольцо прогресса — фирменный элемент: диапазон движения сустава = дуга.
// Рисуем два круга (дорожка + активная дуга) через SVG.
export function ProgressRing({
  progress,
  size = 236,
  stroke = 12,
  children,
}: Props) {
  const clamped = Math.max(0, Math.min(1, progress));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped);

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped * 100)}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-2)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--data)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1s linear",
            filter:
              "drop-shadow(0 0 7px color-mix(in oklab, var(--data) 55%, transparent))",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
