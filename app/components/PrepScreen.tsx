"use client";

import { useState } from "react";
import {
  movements,
  muscleGroups,
  zoneTitle,
  type MovementId,
  type MuscleGroupId,
  type PrepMode,
} from "../data/mobility";
import { hapticImpact, hapticSelection } from "../lib/haptics";
import { WorkoutArt } from "./WorkoutArt";

type Props = {
  onBack: () => void;
  onStartWarmup: (movementId: MovementId) => void;
  onStartCooldown: (muscleId: MuscleGroupId) => void;
};

export function PrepScreen({ onBack, onStartWarmup, onStartCooldown }: Props) {
  const [mode, setMode] = useState<PrepMode>("warmup");

  return (
    <main className="flex-1 px-5 pb-16 pt-8">
      <button
        onClick={onBack}
        className="mb-6 -ml-1 flex w-fit items-center gap-1 text-sm text-muted transition active:opacity-60"
      >
        ‹ Назад
      </button>

      <h1 className="font-display text-3xl font-extrabold">
        {mode === "warmup" ? "Разминка" : "Заминка"}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {mode === "warmup"
          ? "Выбери движение — подготовим нужные зоны тела перед подходом."
          : "Выбери мышцы, что работали, — растянем их после тренировки."}
      </p>

      {/* Переключатель разминка / заминка. */}
      <div className="mt-6 flex rounded-2xl border border-surface-border bg-surface p-1">
        {(
          [
            ["warmup", "Разминка"],
            ["cooldown", "Заминка"],
          ] as [PrepMode, string][]
        ).map(([value, label]) => (
          <button
            key={value}
            onClick={() => {
              hapticSelection();
              setMode(value);
            }}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition ${
              mode === value
                ? "bg-accent text-accent-ink"
                : "text-muted active:opacity-60"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "warmup" ? (
        <>
          <h2 className="mb-3 mt-8 font-mono text-xs uppercase tracking-[0.18em] text-muted">
            Выбери движение
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {movements.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  hapticImpact("medium");
                  onStartWarmup(m.id);
                }}
                className="elevate flex flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface text-left transition active:scale-[0.98]"
              >
                <WorkoutArt id={m.id} className="h-20 w-full" />
                <div className="p-3">
                  <span className="block text-sm font-bold leading-tight">
                    {m.title}
                  </span>
                  <span className="mt-1 block text-[11px] text-muted">
                    {m.zones.slice(0, 3).map(zoneTitle).join(" · ")}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <h2 className="mb-3 mt-8 font-mono text-xs uppercase tracking-[0.18em] text-muted">
            Выбери мышцы
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {muscleGroups.map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  hapticImpact("medium");
                  onStartCooldown(g.id);
                }}
                className="elevate flex items-center justify-between gap-2 rounded-2xl border border-surface-border bg-surface p-4 text-left transition active:scale-[0.98]"
              >
                <span className="text-sm font-bold leading-tight">
                  {g.title}
                </span>
                {g.general && (
                  <span className="shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-muted">
                    общее
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
