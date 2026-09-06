"use client";

import { totalMinutes, type Workout } from "../data/workouts";
import { hapticImpact } from "../lib/haptics";
import { WorkoutArt } from "./WorkoutArt";

/** Секунды → «M:SS» или «N сек». */
function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}:${String(s).padStart(2, "0")}` : `${s} сек`;
}

type Props = {
  workout: Workout;
  onBack: () => void;
  onStart: () => void;
};

export function WorkoutScreen({ workout, onBack, onStart }: Props) {
  return (
    <main className="flex flex-1 flex-col px-5 pb-28 pt-8">
      <button
        onClick={onBack}
        className="mb-6 -ml-1 flex w-fit items-center gap-1 text-sm text-muted transition active:opacity-60"
      >
        ‹ Назад
      </button>

      <WorkoutArt
        id={workout.id}
        className="elevate mb-6 h-40 w-full rounded-3xl border border-surface-border"
      />

      <div className="mb-8 flex flex-col items-center text-center">
        <h1 className="font-display text-3xl font-extrabold">
          {workout.title}
        </h1>
        <p className="mt-2 text-sm text-muted">{workout.subtitle}</p>
        <p className="mt-3 font-mono text-xs uppercase tracking-wider text-muted">
          {workout.exercises.length} упр · {totalMinutes(workout)} мин ·{" "}
          {workout.level}
        </p>
      </div>

      <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-muted">
        Упражнения
      </h2>
      <ol className="flex flex-col gap-2">
        {workout.exercises.map((ex, i) => (
          <li
            key={ex.id}
            className="flex items-center gap-3 rounded-xl border border-surface-border bg-surface px-4 py-3"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2 font-mono text-xs text-muted">
              {i + 1}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {ex.title}
            </span>
            <span className="shrink-0 font-mono text-xs text-muted">
              {fmt(ex.duration)}
            </span>
          </li>
        ))}
      </ol>

      {/* Закреплённая снизу кнопка старта. */}
      <div className="fixed inset-x-0 bottom-0 border-t border-surface-border bg-background/85 px-5 py-4 backdrop-blur">
        <button
          onClick={() => {
            hapticImpact("medium");
            onStart();
          }}
          className="elevate w-full rounded-2xl bg-accent py-4 text-base font-bold text-accent-ink transition active:scale-[0.98]"
        >
          Начать тренировку
        </button>
      </div>
    </main>
  );
}
