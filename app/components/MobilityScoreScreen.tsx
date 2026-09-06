"use client";

import {
  overallScore,
  zoneTitle,
  type MobilityResult,
  type ZoneId,
} from "../data/mobility";
import { ProgressRing } from "./ProgressRing";
import { hapticImpact } from "../lib/haptics";

// Короткие подписи под шкалами, чтобы влезли под 6 столбиков.
const shortZone: Record<ZoneId, string> = {
  shoulders: "Плечи",
  overhead: "Н/гол",
  thoracic: "Грудь",
  hips: "Таз",
  posterior: "Задняя",
  ankles: "Голень",
  wrists: "Кисти",
};

/** Цвет шкалы по баллу: высокий — зелёный, средний — жёлто-зелёный, низкий — янтарь. */
function scoreColor(score: number): string {
  if (score >= 80) return "var(--data)";
  if (score >= 55) return "#cfe06a";
  return "#e8b45a";
}

type Props = {
  results: MobilityResult[];
  onDone: () => void;
  onRetake: () => void;
  onWarmupZone: (zone: ZoneId) => void;
};

export function MobilityScoreScreen({
  results,
  onDone,
  onRetake,
  onWarmupZone,
}: Props) {
  const overall = overallScore(results);
  const weakest = results.reduce(
    (min, r) => (r.score < min.score ? r : min),
    results[0],
  );

  return (
    <main className="flex flex-1 flex-col px-5 pb-10 pt-8">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-strong">
        Твой результат
      </p>
      <h1 className="mt-1 font-display text-4xl font-extrabold">
        Mobility score
      </h1>

      {/* Общий балл в кольце. */}
      <div className="mt-6 flex justify-center">
        <ProgressRing progress={overall / 100} size={200}>
          <span className="font-display text-5xl font-extrabold tabular-nums">
            {overall}
            <span className="text-2xl">%</span>
          </span>
        </ProgressRing>
      </div>

      {/* Шкалы по зонам. */}
      <div className="mt-10 flex h-44 items-end justify-between gap-2">
        {results.map((r) => (
          <div key={r.zone} className="flex flex-1 flex-col items-center gap-2">
            <span className="font-mono text-xs font-semibold">{r.score}</span>
            <div className="flex w-full flex-1 items-end justify-center">
              <div className="flex h-full w-3 items-end overflow-hidden rounded-full bg-surface-2">
                <div
                  className="w-full rounded-full"
                  style={{
                    height: `${r.score}%`,
                    background: scoreColor(r.score),
                  }}
                />
              </div>
            </div>
            <span className="text-[10px] text-muted">{shortZone[r.zone]}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-surface-border bg-surface p-4">
        <p className="text-sm text-muted">
          Слабее всего —{" "}
          <span className="font-semibold text-foreground">
            {zoneTitle(weakest.zone).toLowerCase()}
          </span>
          . Начни с неё.
        </p>
        <button
          onClick={() => {
            hapticImpact("medium");
            onWarmupZone(weakest.zone);
          }}
          className="elevate mt-3 w-full rounded-xl bg-accent py-3 text-sm font-bold text-accent-ink transition active:scale-[0.98]"
        >
          Размять: {zoneTitle(weakest.zone).toLowerCase()}
        </button>
      </div>

      <div className="mt-auto flex gap-3 pt-8">
        <button
          onClick={() => {
            hapticImpact("medium");
            onDone();
          }}
          className="elevate flex-1 rounded-2xl bg-accent py-4 text-base font-bold text-accent-ink transition active:scale-[0.98]"
        >
          Готово
        </button>
        <button
          onClick={onRetake}
          className="rounded-2xl border border-surface-border px-5 text-base font-medium text-foreground transition active:scale-[0.98]"
        >
          Заново
        </button>
      </div>
    </main>
  );
}
