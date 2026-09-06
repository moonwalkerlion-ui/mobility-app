"use client";

import { workouts, totalMinutes, type Level } from "../data/workouts";
import type { ZoneId } from "../data/mobility";
import { hapticImpact } from "../lib/haptics";
import { pluralDays } from "../lib/progress";
import { WorkoutArt } from "./WorkoutArt";

const levelBadge: Record<Level, string> = {
  Начинающий: "text-accent-strong",
  Средний: "text-amber-300/90",
  Продвинутый: "text-rose-300/90",
};

type Props = {
  name: string;
  streak: number;
  week: { label: string; done: boolean }[];
  lastScore?: number;
  recommendedZone?: { id: ZoneId; title: string };
  onOpenWorkout: (id: string) => void;
  onStartWorkout: (id: string) => void;
  onOpenPrep: () => void;
  onOpenTest: () => void;
  onWarmupZone: (zone: ZoneId) => void;
};

export function HomeScreen({
  name,
  streak,
  week,
  lastScore,
  recommendedZone,
  onOpenWorkout,
  onStartWorkout,
  onOpenPrep,
  onOpenTest,
  onWarmupZone,
}: Props) {
  const featured = workouts[0];
  const rest = workouts.slice(1);

  return (
    <main className="flex-1 px-5 pb-16 pt-12">
      <header className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Сегодня · практика
        </p>
        <h1 className="title-glow mt-2 font-display text-5xl font-extrabold leading-none text-accent-strong">
          Сегодня
        </h1>
        <p className="mt-3 text-[15px] text-muted">
          Привет, {name}. Пара минут для тела.
        </p>
      </header>

      {/* Тренировка дня — главный герой экрана. */}
      <section className="elevate overflow-hidden rounded-3xl border border-surface-border bg-surface">
        <WorkoutArt id={featured.id} className="h-56 w-full" />
        <div className="p-6">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent-strong">
          Тренировка дня
        </p>
        <h2 className="mt-2 font-display text-3xl font-extrabold leading-tight">
          {featured.title}
        </h2>
        <p className="mt-1 text-sm text-muted">{featured.subtitle}</p>
        <p className="mt-4 font-mono text-sm text-muted">
          {featured.exercises.length} упр
          <span className="mx-2 opacity-40">·</span>
          {totalMinutes(featured)} мин
          <span className="mx-2 opacity-40">·</span>
          <span className={levelBadge[featured.level]}>{featured.level}</span>
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => {
              hapticImpact("medium");
              onStartWorkout(featured.id);
            }}
            className="elevate flex-1 rounded-2xl bg-accent py-3.5 text-[15px] font-bold text-accent-ink transition active:scale-[0.98]"
          >
            Начать
          </button>
          <button
            onClick={() => {
              hapticImpact("light");
              onOpenWorkout(featured.id);
            }}
            className="rounded-2xl border border-surface-border px-5 text-[15px] font-medium text-foreground transition active:scale-[0.98]"
          >
            Обзор
          </button>
        </div>
        </div>
      </section>

      {/* Персональная рекомендация — появляется после теста. */}
      {recommendedZone && (
        <button
          onClick={() => {
            hapticImpact("medium");
            onWarmupZone(recommendedZone.id);
          }}
          className="elevate mt-5 flex w-full items-center gap-4 rounded-2xl border border-accent/40 bg-surface p-4 text-left transition active:scale-[0.98]"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-2xl">
            🎯
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-strong">
              Рекомендуем
            </p>
            <h3 className="mt-0.5 text-[15px] font-bold">
              Размять: {recommendedZone.title.toLowerCase()}
            </h3>
            <p className="mt-0.5 text-sm text-muted">
              Твоя слабая зона по тесту
            </p>
          </div>
          <span className="text-muted">›</span>
        </button>
      )}

      {/* Вход в тест на подвижность. */}
      <button
        onClick={onOpenTest}
        className="elevate mt-5 flex w-full items-center gap-4 rounded-2xl border border-surface-border bg-surface p-4 text-left transition active:scale-[0.98]"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-data font-display text-base font-extrabold tabular-nums text-data">
          {lastScore != null ? lastScore : "%"}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-bold">Тест на подвижность</h3>
          <p className="mt-0.5 text-sm text-muted">
            {lastScore != null
              ? `Последний результат: ${lastScore}%. Пройти заново?`
              : "Узнай свой Mobility score по зонам тела"}
          </p>
        </div>
        <span className="text-muted">›</span>
      </button>

      {/* Вход в фичу «Разминка/заминка под движение». */}
      <button
        onClick={onOpenPrep}
        className="elevate mt-5 flex w-full items-center gap-4 rounded-2xl border border-surface-border bg-surface p-4 text-left transition active:scale-[0.98]"
      >
        <WorkoutArt
          id="prep-warmup"
          className="h-14 w-14 shrink-0 rounded-xl border border-surface-border"
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-bold">Разминка под движение</h3>
          <p className="mt-0.5 text-sm text-muted">
            Разомнись или заминись под присед, тягу, рывок…
          </p>
        </div>
        <span className="text-muted">›</span>
      </button>

      {/* Твоя неделя — реальные данные из прогресса. */}
      <section className="mt-9">
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="text-sm font-semibold">Твоя неделя</h3>
          <span className="font-mono text-xs text-muted">
            {streak > 0 ? `${pluralDays(streak)} подряд` : "Начни серию"}
          </span>
        </div>
        <div className="flex justify-between">
          {week.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs ${
                  d.done
                    ? "border-transparent bg-data text-data-ink"
                    : "border-surface-border text-muted"
                }`}
              >
                {d.done ? "✓" : ""}
              </span>
              <span className="text-[11px] text-muted">{d.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Каталог программ. */}
      <section className="mt-10">
        <h3 className="mb-3 text-sm font-semibold">Все программы</h3>
        <div className="flex flex-col gap-3">
          {rest.map((w) => (
            <button
              key={w.id}
              onClick={() => {
                hapticImpact("light");
                onOpenWorkout(w.id);
              }}
              className="elevate flex items-center gap-4 rounded-2xl border border-surface-border bg-surface p-4 text-left transition active:scale-[0.98]"
            >
              <WorkoutArt
                id={w.id}
                className="h-16 w-16 shrink-0 rounded-xl border border-surface-border"
              />
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-[15px] font-semibold">{w.title}</h4>
                <p className="mt-0.5 truncate text-sm text-muted">
                  {w.subtitle}
                </p>
                <p className="mt-1.5 font-mono text-xs text-muted">
                  {w.exercises.length} упр · {totalMinutes(w)} мин ·{" "}
                  <span className={levelBadge[w.level]}>{w.level}</span>
                </p>
              </div>
              <span className="text-muted">›</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
